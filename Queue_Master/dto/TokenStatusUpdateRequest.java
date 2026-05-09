package com.example.Queue_Master.dto;

import com.example.Queue_Master.entity.Token.TokenStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request body for PATCH /api/staff/token/{tokenId}/status
 * StaffDashboard.jsx sends: { status: "COMPLETED" | "SKIPPED" | "NO_SHOW" }
 */
@Data
public class TokenStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private TokenStatus status;
}