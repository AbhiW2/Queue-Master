package com.example.Queue_Master.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// ── Step 1: User submits their email to request an OTP ──────────────────────
public class PasswordResetDTOs {

    public record ForgotPasswordRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Enter a valid email address")
            String email
    ) {}

    // ── Step 2: User submits email + OTP to verify ──────────────────────────
    public record VerifyOtpRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Enter a valid email address")
            String email,

            @NotBlank(message = "OTP is required")
            @Pattern(regexp = "\\d{6}", message = "OTP must be exactly 6 digits")
            String otp
    ) {}

    // ── Step 3: User submits new password after OTP is verified ─────────────
    public record ResetPasswordRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Enter a valid email address")
            String email,

            @NotBlank(message = "OTP is required")
            @Pattern(regexp = "\\d{6}", message = "OTP must be exactly 6 digits")
            String otp,

            @NotBlank(message = "New password is required")
            @Size(min = 6, max = 100, message = "Password must be 6–100 characters")
            String newPassword,

            @NotBlank(message = "Please confirm your password")
            String confirmPassword
    ) {}

    // Generic response wrapper
    public record MessageResponse(
            String message,
            boolean success
    ) {}
}