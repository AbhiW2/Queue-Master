package com.example.Queue_Master.dto;

public class StaffDTO {

    // ── Branch Info ───────────────────────────────────────────
    public static class StaffBranchInfo {
        public Long    branchId;
        public String  branchName;
        public String  branchStatus;
        public Long    categoryId;
        public String  categoryName;
        public boolean isHospital;

        public StaffBranchInfo(Long branchId, String branchName, String branchStatus,
                               Long categoryId, String categoryName, boolean isHospital) {
            this.branchId     = branchId;
            this.branchName   = branchName;
            this.branchStatus = branchStatus;
            this.categoryId   = categoryId;
            this.categoryName = categoryName;
            this.isHospital   = isHospital;
        }
    }

    // ── Doctor option ─────────────────────────────────────────
    public static class DoctorOption {
        public Long   id;
        public String name;
        public String specialization;
        public String timing;
        public String status;

        public DoctorOption(Long id, String name, String specialization,
                            String timing, String status) {
            this.id             = id;
            this.name           = name;
            this.specialization = specialization;
            this.timing         = timing;
            this.status         = status;
        }
    }

    // ── Service option ────────────────────────────────────────
    public static class ServiceOption {
        public Long   id;
        public String name;
        public String counter;
        public String timing;
        public String status;

        public ServiceOption(Long id, String name, String counter,
                             String timing, String status) {
            this.id      = id;
            this.name    = name;
            this.counter = counter;
            this.timing  = timing;
            this.status  = status;
        }
    }

    // ── Queue Stats ───────────────────────────────────────────
    public static class QueueStats {
        public long   totalToday;
        public long   waiting;
        public long   inProgress;
        public long   completed;
        public long   cancelled;
        public String currentlyServing;

        public QueueStats(long totalToday, long waiting, long inProgress,
                          long completed, long cancelled, String currentlyServing) {
            this.totalToday       = totalToday;
            this.waiting          = waiting;
            this.inProgress       = inProgress;
            this.completed        = completed;
            this.cancelled        = cancelled;
            this.currentlyServing = currentlyServing;
        }
    }

    // ── Token item in queue ───────────────────────────────────
    public static class QueueTokenItem {
        public Long   tokenId;
        public String displayToken;
        public int    tokenNumber;
        public String status;
        public String customerName;
        public String bookingDate;
        public String serviceName;
        public String queueType;

        public QueueTokenItem(Long tokenId, String displayToken, int tokenNumber,
                              String status, String customerName, String bookingDate,
                              String serviceName, String queueType) {
            this.tokenId      = tokenId;
            this.displayToken = displayToken;
            this.tokenNumber  = tokenNumber;
            this.status       = status;
            this.customerName = customerName;
            this.bookingDate  = bookingDate;
            this.serviceName  = serviceName;
            this.queueType    = queueType;
        }
    }

    // ── Call next response ────────────────────────────────────
    public static class CallNextResponse {
        public Long   tokenId;
        public String displayToken;
        public String customerName;
        public String status;
        public String message;

        public CallNextResponse(Long tokenId, String displayToken,
                                String customerName, String status, String message) {
            this.tokenId      = tokenId;
            this.displayToken = displayToken;
            this.customerName = customerName;
            this.status       = status;
            this.message      = message;
        }
    }

    // ── Update token status ───────────────────────────────────
    public static class UpdateTokenStatusRequest {
        public String status;
        public String getStatus() { return status; }
    }
}