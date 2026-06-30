package com.example.Queue_Master.dto;

import com.example.Queue_Master.entity.Token.QueueType;
import com.example.Queue_Master.entity.Token.ShiftType;
import com.example.Queue_Master.entity.Token.TokenStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class TokenResponse {

    private Long        tokenId;
    private String      displayToken;
    private Integer     tokenNumber;
    private Integer     queuePosition;
    private Integer     estimatedWaitTimeMinutes;
    private QueueType   queueType;
    private TokenStatus status;
    private LocalDate   bookingDate;

    // ── NEW: shift fields ───────────────────────────────────────────────
    private ShiftType shift;
    private String    shiftLabel;   // e.g. "Morning (9:00 AM – 1:00 PM)"

    // ── NEW: slot scheduling fields ─────────────────────────────────────
    private LocalTime scheduledTime;
    private LocalTime slotEndTime;
    private Integer   slotDurationMinutes;

    // Doctor fields
    private Long   doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorTiming;

    // Branch-service fields
    private Long   branchServiceId;
    private String branchServiceName;
    private String branchServiceCounter;
    private String branchServiceTiming;

    // Branch fields
    private Long   branchId;
    private String branchName;
    private String branchLocation;

    // User fields
    private Long   userId;
    private String userName;

    private LocalDateTime bookedAt;
    private String        message;
}