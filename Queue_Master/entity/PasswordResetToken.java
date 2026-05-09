package com.example.Queue_Master.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens",
        indexes = {
                @Index(name = "idx_prt_email",  columnList = "email"),
                @Index(name = "idx_prt_token",  columnList = "otp_code")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The email this OTP belongs to
    @Column(nullable = false)
    private String email;

    // 6-digit numeric OTP stored as a hashed value (BCrypt)
    @Column(name = "otp_code", nullable = false)
    private String otpCode;

    // When the OTP expires (10 minutes from creation)
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    // Whether this OTP has already been used
    @Column(nullable = false)
    private boolean used = false;

    // Number of failed verification attempts (max 5 before lockout)
    @Column(name = "attempt_count", nullable = false)
    private int attemptCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }

    public boolean isExhausted() {
        return this.attemptCount >= 5;
    }
}