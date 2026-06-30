//package com.example.Queue_Master.controller;
//
//import com.example.Queue_Master.dto.SuperAdminDTO.*;
//import com.example.Queue_Master.service.SuperAdminService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/super-admin")
//@RequiredArgsConstructor
//@PreAuthorize("hasRole('SUPER_ADMIN')")
//public class SuperAdminController {
//
//    private final SuperAdminService superAdminService;
//
//    // ── Dashboard ──────────────────────────────────────────
//    @GetMapping("/dashboard-stats")
//    public ResponseEntity<?> getDashboardStats() {
//        try {
//            return ResponseEntity.ok(superAdminService.getDashboardStats());
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    // ── Branches ───────────────────────────────────────────
//    @GetMapping("/branches")
//    public ResponseEntity<?> getAllBranches() {
//        try {
//            return ResponseEntity.ok(superAdminService.getAllBranches());
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    @PostMapping("/branches")
//    public ResponseEntity<?> createBranch(@RequestBody CreateBranchRequest req) {
//        try {
//            return ResponseEntity.ok(superAdminService.createBranch(req));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    @DeleteMapping("/branches/{id}")
//    public ResponseEntity<?> deleteBranch(@PathVariable Long id) {
//        try {
//            superAdminService.deleteBranch(id);
//            return ResponseEntity.ok(Map.of("message", "Branch deleted successfully."));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    // ── Admins ─────────────────────────────────────────────
//    @GetMapping("/admins")
//    public ResponseEntity<?> getAllAdmins() {
//        try {
//            return ResponseEntity.ok(superAdminService.getAllAdmins());
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    @PostMapping("/create-admin")
//    public ResponseEntity<?> createAdmin(@RequestBody CreateAdminRequest req) {
//        try {
//            return ResponseEntity.ok(superAdminService.createAdmin(req));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    @DeleteMapping("/admins/{id}")
//    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
//        try {
//            superAdminService.deleteAdmin(id);
//            return ResponseEntity.ok(Map.of("message", "Admin removed successfully."));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    // ── Users ──────────────────────────────────────────────
//    @GetMapping("/users")
//    public ResponseEntity<?> getAllUsers() {
//        try {
//            return ResponseEntity.ok(superAdminService.getAllUsers());
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    @DeleteMapping("/users/{id}")
//    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
//        try {
//            superAdminService.deleteUser(id);
//            return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    @PatchMapping("/users/{id}/role")
//    public ResponseEntity<?> changeUserRole(@PathVariable Long id,
//                                            @RequestBody ChangeRoleRequest req) {
//        try {
//            return ResponseEntity.ok(superAdminService.changeUserRole(id, req.getRole()));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    // ── Tokens ─────────────────────────────────────────────
//    @GetMapping("/tokens")
//    public ResponseEntity<?> getTokenOverview() {
//        try {
//            return ResponseEntity.ok(superAdminService.getTokenOverview());
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//}











package com.example.Queue_Master.controller;

import com.example.Queue_Master.dto.SuperAdminDTO.*;
import com.example.Queue_Master.service.SuperAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    // ── Dashboard ──────────────────────────────────────────
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            return ResponseEntity.ok(superAdminService.getDashboardStats());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Branches ───────────────────────────────────────────
    @GetMapping("/branches")
    public ResponseEntity<?> getAllBranches() {
        try {
            return ResponseEntity.ok(superAdminService.getAllBranches());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/branches")
    public ResponseEntity<?> createBranch(@RequestBody CreateBranchRequest req) {
        try {
            return ResponseEntity.ok(superAdminService.createBranch(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/branches/{id}")
    public ResponseEntity<?> deleteBranch(@PathVariable Long id) {
        try {
            superAdminService.deleteBranch(id);
            return ResponseEntity.ok(Map.of("message", "Branch deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/branches/{id}/has-active-tokens")
    public ResponseEntity<?> branchHasActiveTokens(@PathVariable Long id) {
        try {
            boolean hasActive = superAdminService.branchHasActiveTokens(id);
            return ResponseEntity.ok(Map.of("hasActiveTokens", hasActive));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Admins ─────────────────────────────────────────────
    @GetMapping("/admins")
    public ResponseEntity<?> getAllAdmins() {
        try {
            return ResponseEntity.ok(superAdminService.getAllAdmins());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody CreateAdminRequest req) {
        try {
            return ResponseEntity.ok(superAdminService.createAdmin(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        try {
            superAdminService.deleteAdmin(id);
            return ResponseEntity.ok(Map.of("message", "Admin removed successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Users ──────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(superAdminService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            superAdminService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id,
                                            @RequestBody ChangeRoleRequest req) {
        try {
            return ResponseEntity.ok(superAdminService.changeUserRole(id, req.getRole()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Tokens ─────────────────────────────────────────────
    @GetMapping("/tokens")
    public ResponseEntity<?> getTokenOverview() {
        try {
            return ResponseEntity.ok(superAdminService.getTokenOverview());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

