package com.example.Queue_Master.dto;

import java.util.List;

public class SuperAdminDTO {

    // ── Dashboard ─────────────────────────────────────────
    public static class DashboardStatsResponse {
        public long totalBranches;
        public long totalAdmins;
        public long totalUsers;
        public long totalTokensToday;

        public DashboardStatsResponse(long totalBranches, long totalAdmins,
                                      long totalUsers, long totalTokensToday) {
            this.totalBranches    = totalBranches;
            this.totalAdmins      = totalAdmins;
            this.totalUsers       = totalUsers;
            this.totalTokensToday = totalTokensToday;
        }
    }

    // ── Branch ────────────────────────────────────────────
    public static class CreateBranchRequest {
        public String name;
        public String location;
        public String timing;
        public String status;
        public Long   categoryId;

        public String getName()       { return name; }
        public String getLocation()   { return location; }
        public String getTiming()     { return timing; }
        public String getStatus()     { return status; }
        public Long   getCategoryId() { return categoryId; }
    }

    public static class BranchResponse {
        public Long   id;
        public String name;
        public String location;
        public String timing;
        public String status;
        public Long   categoryId;
        public String categoryName;

        public BranchResponse(Long id, String name, String location, String timing,
                              String status, Long categoryId, String categoryName) {
            this.id           = id;
            this.name         = name;
            this.location     = location;
            this.timing       = timing;
            this.status       = status;
            this.categoryId   = categoryId;
            this.categoryName = categoryName;
        }
    }

    // ── Admin ─────────────────────────────────────────────
    public static class CreateAdminRequest {
        public String username;
        public String email;
        public String password;
        public Long   branchId;

        public String getUsername() { return username; }
        public String getEmail()    { return email; }
        public String getPassword() { return password; }
        public Long   getBranchId() { return branchId; }
    }

    public static class AdminResponse {
        public Long           id;
        public String         username;
        public String         email;
        public String         role;
        public BranchResponse branch;

        public AdminResponse(Long id, String username, String email,
                             String role, BranchResponse branch) {
            this.id       = id;
            this.username = username;
            this.email    = email;
            this.role     = role;
            this.branch   = branch;
        }
    }

    // ── User ──────────────────────────────────────────────
    public static class UserResponse {
        public Long   id;
        public String username;
        public String email;
        public String role;

        public UserResponse(Long id, String username, String email, String role) {
            this.id       = id;
            this.username = username;
            this.email    = email;
            this.role     = role;
        }
    }

    public static class ChangeRoleRequest {
        public String role;
        public String getRole() { return role; }
    }

    // ── Token Overview ────────────────────────────────────
    public static class TokenOverviewResponse {
        public long                      todayTotal;
        public long                      todayActive;
        public long                      todayCompleted;
        public long                      todayCancelled;
        public List<RecentTokenResponse> recentTokens;

        public TokenOverviewResponse(long todayTotal, long todayActive,
                                     long todayCompleted, long todayCancelled,
                                     List<RecentTokenResponse> recentTokens) {
            this.todayTotal     = todayTotal;
            this.todayActive    = todayActive;
            this.todayCompleted = todayCompleted;
            this.todayCancelled = todayCancelled;
            this.recentTokens   = recentTokens;
        }
    }

    public static class RecentTokenResponse {
        public Long   id;
        public String displayToken;
        public String status;
        public String username;
        public String branchName;
        public String serviceName;
        public String bookingDate;

        public RecentTokenResponse(Long id, String displayToken, String status,
                                   String username, String branchName,
                                   String serviceName, String bookingDate) {
            this.id           = id;
            this.displayToken = displayToken;
            this.status       = status;
            this.username     = username;
            this.branchName   = branchName;
            this.serviceName  = serviceName;
            this.bookingDate  = bookingDate;
        }
    }
}