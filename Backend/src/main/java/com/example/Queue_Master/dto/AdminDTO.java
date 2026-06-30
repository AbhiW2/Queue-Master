
package com.example.Queue_Master.dto;

public class AdminDTO {

    // ── Dashboard ─────────────────────────────────────────
    public static class AdminDashboardStats {
        public long   totalDoctors;
        public long   totalServices;
        public long   totalStaff;
        public long   activeTokensToday;
        public long   completedTokensToday;
        public long   cancelledTokensToday;
        public String branchName;
        public String branchStatus;
        public Long   branchCategoryId; // ✅ NEW

        public AdminDashboardStats(long totalDoctors, long totalServices,
                                   long totalStaff, long activeTokensToday,
                                   long completedTokensToday, long cancelledTokensToday,
                                   String branchName, String branchStatus,
                                   Long branchCategoryId) {
            this.totalDoctors         = totalDoctors;
            this.totalServices        = totalServices;
            this.totalStaff           = totalStaff;
            this.activeTokensToday    = activeTokensToday;
            this.completedTokensToday = completedTokensToday;
            this.cancelledTokensToday = cancelledTokensToday;
            this.branchName           = branchName;
            this.branchStatus         = branchStatus;
            this.branchCategoryId     = branchCategoryId;
        }
    }

    // ── Doctor ────────────────────────────────────────────
    public static class CreateDoctorRequest {
        public String name;
        public String specialization;
        public String experience;
        public String timing;
        public String status;
        public int    avgConsultationTime;

        public String getName()                { return name; }
        public String getSpecialization()      { return specialization; }
        public String getExperience()          { return experience; }
        public String getTiming()              { return timing; }
        public String getStatus()              { return status; }
        public int    getAvgConsultationTime() { return avgConsultationTime; }
    }

    public static class DoctorResponse {
        public Long   id;
        public String name;
        public String specialization;
        public String experience;
        public String timing;
        public double rating;
        public String status;
        public int    avgConsultationTime;
        public Long   branchId;
        public String branchName;

        public DoctorResponse(Long id, String name, String specialization,
                              String experience, String timing, double rating,
                              String status, int avgConsultationTime,
                              Long branchId, String branchName) {
            this.id                  = id;
            this.name                = name;
            this.specialization      = specialization;
            this.experience          = experience;
            this.timing              = timing;
            this.rating              = rating;
            this.status              = status;
            this.avgConsultationTime = avgConsultationTime;
            this.branchId            = branchId;
            this.branchName          = branchName;
        }
    }

    // ── Branch Service ────────────────────────────────────
    public static class CreateServiceRequest {
        public String  name;
        public String  description;
        public String  counter;
        public String  timing;
        public String  status;
        public Integer avgServiceTimeMinutes;

        public String  getName()                  { return name; }
        public String  getDescription()           { return description; }
        public String  getCounter()               { return counter; }
        public String  getTiming()                { return timing; }
        public String  getStatus()                { return status; }
        public Integer getAvgServiceTimeMinutes() { return avgServiceTimeMinutes; }
    }

    public static class ServiceResponse {
        public Long    id;
        public String  name;
        public String  description;
        public String  counter;
        public String  timing;
        public String  status;
        public Integer avgServiceTimeMinutes;
        public Long    branchId;
        public String  branchName;

        public ServiceResponse(Long id, String name, String description,
                               String counter, String timing, String status,
                               Integer avgServiceTimeMinutes,
                               Long branchId, String branchName) {
            this.id                    = id;
            this.name                  = name;
            this.description           = description;
            this.counter               = counter;
            this.timing                = timing;
            this.status                = status;
            this.avgServiceTimeMinutes = avgServiceTimeMinutes;
            this.branchId              = branchId;
            this.branchName            = branchName;
        }
    }

    // ── Staff ─────────────────────────────────────────────
    public static class CreateStaffRequest {
        public String username;
        public String email;
        public String password;

        public String getUsername() { return username; }
        public String getEmail()    { return email; }
        public String getPassword() { return password; }
    }

    public static class StaffResponse {
        public Long   id;
        public String username;
        public String email;
        public String role;
        public String branchName;

        public StaffResponse(Long id, String username, String email,
                             String role, String branchName) {
            this.id         = id;
            this.username   = username;
            this.email      = email;
            this.role       = role;
            this.branchName = branchName;
        }
    }

    // ── Queue Token ───────────────────────────────────────
    public static class QueueTokenResponse {
        public Long   id;
        public String displayToken;
        public String status;
        public String username;
        public String serviceName;
        public String queueType;
        public String bookingDate;
        public int    tokenNumber;

        public QueueTokenResponse(Long id, String displayToken, String status,
                                  String username, String serviceName,
                                  String queueType, String bookingDate,
                                  int tokenNumber) {
            this.id           = id;
            this.displayToken = displayToken;
            this.status       = status;
            this.username     = username;
            this.serviceName  = serviceName;
            this.queueType    = queueType;
            this.bookingDate  = bookingDate;
            this.tokenNumber  = tokenNumber;
        }
    }
}