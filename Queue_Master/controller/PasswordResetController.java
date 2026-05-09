package com.example.Queue_Master.controller;

import com.example.Queue_Master.dto.PasswordResetDTOs.*;
import com.example.Queue_Master.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/password-reset")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    /**
     * POST /api/auth/password-reset/request
     * Body: { "email": "user@example.com" }
     *
     * Sends a 6-digit OTP to the email.
     * Always returns 200 with the same message (prevents email enumeration).
     */
    @PostMapping("/request")
    public ResponseEntity<MessageResponse> requestOtp(
            @Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(passwordResetService.requestOtp(request));
    }

    /**
     * POST /api/auth/password-reset/verify
     * Body: { "email": "user@example.com", "otp": "123456" }
     *
     * Verifies the OTP is correct and not expired.
     * Returns 200 on success so the frontend can advance to step 3.
     */
    @PostMapping("/verify")
    public ResponseEntity<MessageResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(passwordResetService.verifyOtp(request));
    }

    /**
     * POST /api/auth/password-reset/reset
     * Body: { "email": "...", "otp": "123456",
     *         "newPassword": "...", "confirmPassword": "..." }
     *
     * Verifies OTP one final time, updates the password, and
     * invalidates all reset tokens for that email.
     */
    @PostMapping("/reset")
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(passwordResetService.resetPassword(request));
    }
}