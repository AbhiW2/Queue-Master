package com.example.Queue_Master.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Stats summary shown in the Staff hero panel.
 * Field names match exactly what StaffStats.jsx reads:
 *   stats.currentlyServing, stats.totalToday, stats.waiting,
 *   stats.inProgress, stats.completed, stats.cancelled
 */
@Data
@Builder
public class StaffStatsResponse {

    private String  currentlyServing;   // display token e.g. "D001", or "—"
    private long    totalToday;
    private long    waiting;
    private long    inProgress;
    private long    completed;
    private long    cancelled;
    private long    skipped;
    private long    noShow;
}