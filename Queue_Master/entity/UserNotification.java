package com.example.Queue_Master.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_notifications",
        indexes = {
                @Index(name = "idx_notif_user_read", columnList = "user_id, is_read"),
                @Index(name = "idx_notif_created",   columnList = "created_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Who receives this notification ────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ── Which token triggered it (optional) ───────────────
    @Column(name = "token_id")
    private Long tokenId;

    @Column(name = "display_token", length = 20)
    private String displayToken;

    // ── Notification content ──────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private NotificationType type;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "message", nullable = false, length = 500)
    private String message;

    // ── Read status ───────────────────────────────────────
    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean read = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum NotificationType {
        TOKEN_BOOKED,       // user just booked
        TOKEN_CANCELLED,    // user cancelled / someone else's cancel shifted queue
        QUEUE_UPDATED,      // queue position moved forward
        TURN_NEAR,          // ≤ 2 people ahead
        YOUR_TURN,          // status = IN_PROGRESS / CALLED
        TOKEN_COMPLETED     // service done
    }
}