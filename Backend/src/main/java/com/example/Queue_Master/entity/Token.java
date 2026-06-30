package com.example.Queue_Master.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(
        name = "tokens",
        indexes = {
                @Index(name = "idx_token_doctor_date", columnList = "doctor_id, booking_date"),
                @Index(name = "idx_token_bs_date",      columnList = "branch_service_id, booking_date"),
                @Index(name = "idx_token_user",         columnList = "user_id"),
                @Index(name = "idx_token_status",       columnList = "status")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token_number", nullable = false)
    private Integer tokenNumber;

    @Column(name = "display_token", nullable = false, length = 20)
    private String displayToken;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TokenStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "queue_type", nullable = false, length = 20)
    private QueueType queueType;

    // ── NEW: shift type (MORNING / AFTERNOON) ─────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "shift_type", length = 20)
    private ShiftType shiftType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_service_id")
    private BranchService branchService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "estimated_wait_time")
    private Integer estimatedWaitTimeMinutes;

    @Column(name = "actual_wait_time")
    private Integer actualWaitTimeMinutes;

    // ── NEW: slot scheduling fields ────────────────────────────────────────
    @Column(name = "scheduled_time")
    private LocalTime scheduledTime;

    @Column(name = "slot_end_time")
    private LocalTime slotEndTime;

    @Column(name = "slot_duration_minutes")
    private Integer slotDurationMinutes;

    // ── NEW: soft-delete from user history ────────────────────────────────
    @Column(name = "deleted_by_user")
    @Builder.Default
    private boolean deletedByUser = false;

    @Column(name = "serving_started_at")
    private LocalDateTime servingStartedAt;

    @Column(name = "serving_completed_at")
    private LocalDateTime servingCompletedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    @Column(name = "version")
    private Long version;

    public enum TokenStatus {
        BOOKED, CALLED, IN_PROGRESS, COMPLETED, CANCELLED, SKIPPED, NO_SHOW
    }

    public enum QueueType {
        DOCTOR, BRANCH_SERVICE
    }

    // ── NEW: shift enum ───────────────────────────────────────────────────
    public enum ShiftType {
        MORNING, AFTERNOON
    }
}