package com.example.Queue_Master.controller;

import com.example.Queue_Master.dto.StaffDTO.*;
import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('STAFF','ADMIN','SUPER_ADMIN')")
public class StaffController {

    private final StaffService staffService;

    private String name(User user) { return user.getUsername(); }

    // ── Branch Info ────────────────────────────────────────────
    // GET /api/staff/branch-info
    @GetMapping("/branch-info")
    public ResponseEntity<?> getBranchInfo(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(staffService.getBranchInfo(name(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Selectors ──────────────────────────────────────────────
    // GET /api/staff/doctors  → for hospital staff
    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctorOptions(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(staffService.getDoctorOptions(name(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // GET /api/staff/services  → for non-hospital staff
    @GetMapping("/services")
    public ResponseEntity<?> getServiceOptions(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(staffService.getServiceOptions(name(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Queue ──────────────────────────────────────────────────
    // GET /api/staff/queue/doctor/{doctorId}
    @GetMapping("/queue/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorQueue(@AuthenticationPrincipal User user,
                                            @PathVariable Long doctorId) {
        try {
            return ResponseEntity.ok(staffService.getDoctorQueue(name(user), doctorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // GET /api/staff/queue/service/{serviceId}
    @GetMapping("/queue/service/{serviceId}")
    public ResponseEntity<?> getServiceQueue(@AuthenticationPrincipal User user,
                                             @PathVariable Long serviceId) {
        try {
            return ResponseEntity.ok(staffService.getServiceQueue(name(user), serviceId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Stats ──────────────────────────────────────────────────
    // GET /api/staff/stats/doctor/{doctorId}
    @GetMapping("/stats/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorStats(@AuthenticationPrincipal User user,
                                            @PathVariable Long doctorId) {
        try {
            return ResponseEntity.ok(staffService.getDoctorQueueStats(name(user), doctorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // GET /api/staff/stats/service/{serviceId}
    @GetMapping("/stats/service/{serviceId}")
    public ResponseEntity<?> getServiceStats(@AuthenticationPrincipal User user,
                                             @PathVariable Long serviceId) {
        try {
            return ResponseEntity.ok(staffService.getServiceQueueStats(name(user), serviceId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Call Next ──────────────────────────────────────────────
    // POST /api/staff/call-next/doctor/{doctorId}
    @PostMapping("/call-next/doctor/{doctorId}")
    public ResponseEntity<?> callNextDoctor(@AuthenticationPrincipal User user,
                                            @PathVariable Long doctorId) {
        try {
            return ResponseEntity.ok(staffService.callNextDoctor(name(user), doctorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // POST /api/staff/call-next/service/{serviceId}
    @PostMapping("/call-next/service/{serviceId}")
    public ResponseEntity<?> callNextService(@AuthenticationPrincipal User user,
                                             @PathVariable Long serviceId) {
        try {
            return ResponseEntity.ok(staffService.callNextService(name(user), serviceId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Update Token Status ────────────────────────────────────
    // PATCH /api/staff/token/{tokenId}/status
    @PatchMapping("/token/{tokenId}/status")
    public ResponseEntity<?> updateTokenStatus(@AuthenticationPrincipal User user,
                                               @PathVariable Long tokenId,
                                               @RequestBody UpdateTokenStatusRequest req) {
        try {
            return ResponseEntity.ok(
                    staffService.updateTokenStatus(name(user), tokenId, req.getStatus()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}