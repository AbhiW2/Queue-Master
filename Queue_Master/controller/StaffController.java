
package com.example.Queue_Master.controller;

import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.service.StaffService;
import com.example.Queue_Master.dto.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StaffController {

    private final StaffService staffService;

    // GET /api/staff/branch-info
    @GetMapping("/branch-info")
    public ResponseEntity<Map<String, Object>> getBranchInfo(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(staffService.getBranchInfo(user.getUsername()));
    }

    // GET /api/staff/doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<Map<String, Object>>> getDoctors(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(staffService.getDoctors(user.getUsername()));
    }

    // GET /api/staff/services
    @GetMapping("/services")
    public ResponseEntity<List<Map<String, Object>>> getServices(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(staffService.getServices(user.getUsername()));
    }

    // GET /api/staff/queue/doctor/{doctorId}
    @GetMapping("/queue/doctor/{doctorId}")
    public ResponseEntity<List<Map<String, Object>>> getDoctorQueue(
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(staffService.getDoctorQueue(doctorId, LocalDate.now()));
    }

    // GET /api/staff/queue/service/{serviceId}
    @GetMapping("/queue/service/{serviceId}")
    public ResponseEntity<List<Map<String, Object>>> getServiceQueue(
            @PathVariable Long serviceId) {
        return ResponseEntity.ok(staffService.getServiceQueue(serviceId, LocalDate.now()));
    }

    // GET /api/staff/stats/doctor/{doctorId}
    @GetMapping("/stats/doctor/{doctorId}")
    public ResponseEntity<Map<String, Object>> getDoctorStats(
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(staffService.getDoctorStats(doctorId, LocalDate.now()));
    }

    // GET /api/staff/stats/service/{serviceId}
    @GetMapping("/stats/service/{serviceId}")
    public ResponseEntity<Map<String, Object>> getServiceStats(
            @PathVariable Long serviceId) {
        return ResponseEntity.ok(staffService.getServiceStats(serviceId, LocalDate.now()));
    }

    // POST /api/staff/call-next/doctor/{doctorId}
    @PostMapping("/call-next/doctor/{doctorId}")
    public ResponseEntity<TokenResponse> callNextDoctor(
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(staffService.callNextDoctor(doctorId, LocalDate.now()));
    }

    // POST /api/staff/call-next/service/{serviceId}
    @PostMapping("/call-next/service/{serviceId}")
    public ResponseEntity<TokenResponse> callNextService(
            @PathVariable Long serviceId) {
        return ResponseEntity.ok(staffService.callNextService(serviceId, LocalDate.now()));
    }

    // PATCH /api/staff/token/{tokenId}/status
    // Body: { "status": "COMPLETED" | "SKIPPED" | "NO_SHOW" | "BOOKED" }
    @PatchMapping("/token/{tokenId}/status")
    public ResponseEntity<TokenResponse> updateTokenStatus(
            @PathVariable Long tokenId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(staffService.updateTokenStatus(tokenId, body.get("status")));
    }
}