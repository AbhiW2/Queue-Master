package com.example.Queue_Master.controller;

import com.example.Queue_Master.dto.AdminDTO.*;
import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    private String name(User user) { return user.getUsername(); }

    // ── Dashboard ──────────────────────────────────────────
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(adminService.getDashboardStats(name(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Doctors ────────────────────────────────────────────
    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(adminService.getDoctors(name(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/doctors")
    public ResponseEntity<?> createDoctor(@AuthenticationPrincipal User user,
                                          @RequestBody CreateDoctorRequest req) {
        try {
            return ResponseEntity.ok(adminService.createDoctor(name(user), req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<?> updateDoctor(@AuthenticationPrincipal User user,
                                          @PathVariable Long id,
                                          @RequestBody CreateDoctorRequest req) {
        try {
            return ResponseEntity.ok(adminService.updateDoctor(name(user), id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@AuthenticationPrincipal User user,
                                          @PathVariable Long id) {
        try {
            adminService.deleteDoctor(name(user), id);
            return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Services ───────────────────────────────────────────
    @GetMapping("/services")
    public ResponseEntity<?> getServices(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(adminService.getServices(name(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/services")
    public ResponseEntity<?> createService(@AuthenticationPrincipal User user,
                                           @RequestBody CreateServiceRequest req) {
        try {
            return ResponseEntity.ok(adminService.createService(name(user), req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<?> updateService(@AuthenticationPrincipal User user,
                                           @PathVariable Long id,
                                           @RequestBody CreateServiceRequest req) {
        try {
            return ResponseEntity.ok(adminService.updateService(name(user), id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@AuthenticationPrincipal User user,
                                           @PathVariable Long id) {
        try {
            adminService.deleteService(name(user), id);
            return ResponseEntity.ok(Map.of("message", "Service deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Staff ──────────────────────────────────────────────
    @GetMapping("/staff")
    public ResponseEntity<?> getStaff(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(adminService.getStaff(name(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/staff")
    public ResponseEntity<?> createStaff(@AuthenticationPrincipal User user,
                                         @RequestBody CreateStaffRequest req) {
        try {
            return ResponseEntity.ok(adminService.createStaff(name(user), req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<?> deleteStaff(@AuthenticationPrincipal User user,
                                         @PathVariable Long id) {
        try {
            adminService.deleteStaff(name(user), id);
            return ResponseEntity.ok(Map.of("message", "Staff removed successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Queue ──────────────────────────────────────────────
    @GetMapping("/queue/today")
    public ResponseEntity<?> getTodayQueue(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(adminService.getTodayQueue(name(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}