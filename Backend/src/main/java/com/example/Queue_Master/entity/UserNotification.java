package com.example.Queue_Master.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    /**
     * @JsonIgnore prevents Jackson from serializing the lazily-loaded
     * User proxy outside a transaction → fixes the 500 error.
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "display_token", length = 20)
    private String displayToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 30)
    private NotificationType type;

    @Column(name = "message", nullable = false, length = 512)
    private String message;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean read = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum NotificationType {
        TOKEN_BOOKED,
        TOKEN_CANCELLED,
        YOUR_TURN,
        TURN_NEAR,
        TOKEN_COMPLETED,
        QUEUE_SHIFTED
    }
}