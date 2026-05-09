package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.PasswordResetDTOs.*;
import com.example.Queue_Master.entity.PasswordResetToken;
import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.exception.BadRequestException;
import com.example.Queue_Master.repository.PasswordResetTokenRepository;
import com.example.Queue_Master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepo;
    private final UserRepository               userRepo;
    private final PasswordEncoder              passwordEncoder;
    private final EmailService                 emailService;

    private static final int    OTP_EXPIRY_MINUTES = 10;
    private static final int    MAX_OTP_PER_HOUR   = 3;   // rate limit
    private static final SecureRandom RANDOM        = new SecureRandom();

    // ── Step 1: Request OTP ─────────────────────────────────────────────────
    @Transactional
    public MessageResponse requestOtp(ForgotPasswordRequest request) {
        String email = request.email().toLowerCase().trim();

        // Rate-limit: max 3 OTP requests per hour per email
        long recentCount = tokenRepo.countRecentByEmail(
                email, LocalDateTime.now().minusHours(1));

        if (recentCount >= MAX_OTP_PER_HOUR) {
            throw new BadRequestException(
                    "Too many OTP requests. Please wait before requesting again.");
        }

        // Always return the same message whether the email exists or not.
        // This prevents email enumeration attacks.
        boolean emailExists = userRepo.existsByEmail(email);

        if (emailExists) {
            // Invalidate any existing active OTPs for this email
            // (delete them so old codes can't be reused)
            tokenRepo.deleteAllByEmail(email);

            // Generate cryptographically secure 6-digit OTP
            String rawOtp = generateOtp();

            // Store hashed OTP in DB (never store raw OTP)
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setEmail(email);
            resetToken.setOtpCode(passwordEncoder.encode(rawOtp)); // BCrypt hash
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
            tokenRepo.save(resetToken);

            // Send email asynchronously (won't block this response)
            emailService.sendOtpEmail(email, rawOtp);

            log.info("OTP generated and email dispatched for: {}", email);
        } else {
            log.info("OTP request for non-existent email (silent): {}", email);
        }

        return new MessageResponse(
                "If this email is registered, you will receive an OTP shortly.",
                true
        );
    }

    // ── Step 2: Verify OTP (without resetting password yet) ─────────────────
    @Transactional
    public MessageResponse verifyOtp(VerifyOtpRequest request) {
        String email = request.email().toLowerCase().trim();

        PasswordResetToken token = getValidToken(email);
        validateOtpAttempt(token, request.otp());

        // Mark token as "verified" — don't mark as used yet.
        // The actual used=true happens only when password is reset.
        // This prevents having to re-request if the user navigates back.
        // We just confirm the code is correct here.
        return new MessageResponse("OTP verified successfully.", true);
    }

    // ── Step 3: Reset password after OTP verified ───────────────────────────
    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        String email = request.email().toLowerCase().trim();

        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BadRequestException("Passwords do not match.");
        }

        PasswordResetToken token = getValidToken(email);
        validateOtpAttempt(token, request.otp());

        // Update user's password
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found."));

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepo.save(user);

        // Invalidate all reset tokens for this email
        token.setUsed(true);
        tokenRepo.save(token);
        tokenRepo.deleteAllByEmail(email);

        log.info("Password reset successful for: {}", email);
        return new MessageResponse("Password reset successfully. You can now log in.", true);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private PasswordResetToken getValidToken(String email) {
        return tokenRepo.findActiveByEmail(email, LocalDateTime.now())
                .orElseThrow(() -> new BadRequestException(
                        "No valid OTP found. Please request a new one."));
    }

    private void validateOtpAttempt(PasswordResetToken token, String rawOtp) {
        // Lock out after 5 failed attempts
        if (token.isExhausted()) {
            throw new BadRequestException(
                    "Too many incorrect attempts. Please request a new OTP.");
        }

        boolean matches = passwordEncoder.matches(rawOtp, token.getOtpCode());

        if (!matches) {
            token.setAttemptCount(token.getAttemptCount() + 1);
            tokenRepo.save(token);

            int remaining = 5 - token.getAttemptCount();
            throw new BadRequestException(
                    remaining > 0
                            ? "Invalid OTP. " + remaining + " attempt(s) remaining."
                            : "Too many incorrect attempts. Please request a new OTP.");
        }
    }

    private String generateOtp() {
        // SecureRandom gives a cryptographically strong 6-digit number
        int otp = 100_000 + RANDOM.nextInt(900_000);
        return String.valueOf(otp);
    }

    // ── Scheduled cleanup (runs every hour) ─────────────────────────────────
    @Scheduled(fixedRateString = "PT1H") // ISO-8601 duration — every 1 hour
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepo.deleteExpiredAndUsed(LocalDateTime.now());
        log.debug("Expired/used password reset tokens cleaned up.");
    }
}