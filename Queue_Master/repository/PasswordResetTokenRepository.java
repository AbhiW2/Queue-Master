package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // Find the most recent active (non-used, non-expired) token for an email
    @Query("SELECT p FROM PasswordResetToken p " +
            "WHERE p.email = :email " +
            "  AND p.used = false " +
            "  AND p.expiresAt > :now " +
            "ORDER BY p.createdAt DESC " +
            "LIMIT 1")
    Optional<PasswordResetToken> findActiveByEmail(
            @Param("email") String email,
            @Param("now")   LocalDateTime now);

    // Delete all tokens for an email (cleanup after successful reset)
    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.email = :email")
    void deleteAllByEmail(@Param("email") String email);

    // Cleanup expired tokens (run via scheduled job)
    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.expiresAt < :now OR p.used = true")
    void deleteExpiredAndUsed(@Param("now") LocalDateTime now);

    // Count recent OTP requests for an email (rate-limiting check)
    @Query("SELECT COUNT(p) FROM PasswordResetToken p " +
            "WHERE p.email = :email AND p.createdAt > :since")
    long countRecentByEmail(
            @Param("email") String email,
            @Param("since") LocalDateTime since);
}