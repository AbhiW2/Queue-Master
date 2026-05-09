package com.example.Queue_Master.dto;

import com.example.Queue_Master.entity.Token.QueueType;
import com.example.Queue_Master.entity.Token.TokenStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a single token row in the Staff queue panel.
 * Field names match exactly what StaffTokenCard.jsx / StaffQueuePanel.jsx reads.
 */
@Data
@Builder
public class StaffQueueResponse {

    private Long        tokenId;
    private String      displayToken;
    private Integer     tokenNumber;
    private TokenStatus status;
    private QueueType   queueType;
    private LocalDate   bookingDate;

    // Customer info
    private String customerName;   // maps to token.user.username

    // Service info (shown in card subtitle)
    private String serviceName;    // doctor name OR branch-service name

    // Timing
    private LocalDateTime bookedAt;
    private LocalDateTime servingStartedAt;
    private Integer       estimatedWaitTimeMinutes;
    private Integer       actualWaitTimeMinutes;
}