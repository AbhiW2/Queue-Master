package com.example.Queue_Master.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Returned by GET /api/staff/branch-info.
 *
 * StaffDashboard.jsx reads:
 *   info.isHospital   – true  → show doctors list
 *                       false → show services list
 *   info.branchName   – displayed in sidebar
 *   info.branchId     – used for follow-up calls
 *   info.categoryCode – e.g. "HOSP", "BANK", "GOVT", "HOTL"
 */
@Data
@Builder
public class StaffBranchInfoResponse {

    private Long    branchId;
    private String  branchName;
    private String  branchLocation;
    private String  categoryCode;    // "HOSP" | "BANK" | "GOVT" | "HOTL"
    private boolean isHospital;      // convenience flag for frontend
}