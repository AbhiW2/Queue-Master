//
//package com.example.Queue_Master.service;
//
//import com.example.Queue_Master.dto.SuperAdminDTO.*;
//import com.example.Queue_Master.entity.*;
//import com.example.Queue_Master.repository.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class SuperAdminService {
//
//    private final UserRepository            userRepository;
//    private final BranchRepository          branchRepository;
//    private final ServiceCategoryRepository categoryRepository;
//    private final TokenRepository           tokenRepository;
//    private final PasswordEncoder           passwordEncoder;
//
//    // ═══════════════════════════════════════════════════
//    // DASHBOARD STATS
//    // ═══════════════════════════════════════════════════
//
//    public DashboardStatsResponse getDashboardStats() {
//        long totalBranches    = branchRepository.count();
//        long totalAdmins      = userRepository.findByRole(Role.ADMIN).size();
//        long totalUsers       = userRepository.findByRoleNot(Role.SUPER_ADMIN).size();
//        long totalTokensToday = tokenRepository.findAll().stream()
//                .filter(t -> t.getBookingDate().equals(LocalDate.now()))
//                .count();
//
//        return new DashboardStatsResponse(totalBranches, totalAdmins,
//                totalUsers, totalTokensToday);
//    }
//
//    // ═══════════════════════════════════════════════════
//    // BRANCH MANAGEMENT
//    // ═══════════════════════════════════════════════════
//
//    public List<BranchResponse> getAllBranches() {
//        return branchRepository.findAll().stream()
//                .map(this::toBranchResponse)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public BranchResponse createBranch(CreateBranchRequest req) {
//        ServiceCategory category = categoryRepository.findById(req.getCategoryId())
//                .orElseThrow(() -> new RuntimeException(
//                        "Category not found: " + req.getCategoryId()));
//
//        Branch branch = new Branch();
//        branch.setName(req.getName());
//        branch.setLocation(req.getLocation());
//        branch.setTime(req.getTiming());
//        branch.setStatus(req.getStatus() != null ? req.getStatus() : "Open");
//        branch.setCategory(category);
//
//        return toBranchResponse(branchRepository.save(branch));
//    }
//
//    @Transactional
//    public void deleteBranch(Long branchId) {
//        branchRepository.findById(branchId)
//                .orElseThrow(() -> new RuntimeException("Branch not found: " + branchId));
//
//        // Step 1 — Delete all tokens for this branch
//        List<Token> tokens = tokenRepository.findByBranchId(branchId);
//        if (!tokens.isEmpty()) {
//            tokenRepository.deleteAll(tokens);
//            tokenRepository.flush();
//        }
//
//        // Step 2 — Unlink all admins assigned to this branch
//        // FIX: filter by branchId (Long) instead of getBranch().getId()
//        userRepository.findByRole(Role.ADMIN).stream()
//                .filter(a -> branchId.equals(a.getBranchId()))
//                .forEach(a -> {
//                    // FIX: setBranchId(null) instead of setBranch(null)
//                    a.setBranchId(null);
//                    userRepository.save(a);
//                });
//
//        // Step 3 — Delete branch (cascades to doctors + services)
//        branchRepository.deleteById(branchId);
//    }
//
//    // ═══════════════════════════════════════════════════
//    // ADMIN MANAGEMENT
//    // ═══════════════════════════════════════════════════
//
//    public List<AdminResponse> getAllAdmins() {
//        return userRepository.findByRole(Role.ADMIN).stream()
//                .map(this::toAdminResponse)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public AdminResponse createAdmin(CreateAdminRequest req) {
//        if (userRepository.existsByUsername(req.getUsername()))
//            throw new RuntimeException("Username already taken!");
//        if (userRepository.existsByEmail(req.getEmail()))
//            throw new RuntimeException("Email already registered!");
//
//        Branch branch = branchRepository.findById(req.getBranchId())
//                .orElseThrow(() -> new RuntimeException(
//                        "Branch not found: " + req.getBranchId()));
//
//        User admin = new User();
//        admin.setUsername(req.getUsername());
//        admin.setEmail(req.getEmail());
//        admin.setPassword(passwordEncoder.encode(req.getPassword()));
//        admin.setRole(Role.ADMIN);
//        // FIX: setBranchId(Long) instead of setBranch(Branch)
//        admin.setBranchId(branch.getId());
//
//        return toAdminResponse(userRepository.save(admin));
//    }
//
//    @Transactional
//    public void deleteAdmin(Long adminId) {
//        User admin = userRepository.findById(adminId)
//                .orElseThrow(() -> new RuntimeException("Admin not found: " + adminId));
//        if (admin.getRole() != Role.ADMIN)
//            throw new RuntimeException("User is not an ADMIN.");
//        userRepository.delete(admin);
//    }
//
//    // ═══════════════════════════════════════════════════
//    // USER MANAGEMENT
//    // ═══════════════════════════════════════════════════
//
//    public List<UserResponse> getAllUsers() {
//        return userRepository.findByRoleNot(Role.SUPER_ADMIN).stream()
//                .map(this::toUserResponse)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public void deleteUser(Long userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
//        if (user.getRole() == Role.SUPER_ADMIN)
//            throw new RuntimeException("Cannot delete Super Admin.");
//        userRepository.delete(user);
//    }
//
//    @Transactional
//    public UserResponse changeUserRole(Long userId, String newRole) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
//        if (user.getRole() == Role.SUPER_ADMIN)
//            throw new RuntimeException("Cannot change Super Admin role.");
//        try {
//            user.setRole(Role.valueOf(newRole.toUpperCase()));
//        } catch (IllegalArgumentException e) {
//            throw new RuntimeException("Invalid role: " + newRole);
//        }
//        return toUserResponse(userRepository.save(user));
//    }
//
//    // ═══════════════════════════════════════════════════
//    // TOKEN OVERVIEW
//    // ═══════════════════════════════════════════════════
//
//    public TokenOverviewResponse getTokenOverview() {
//        List<Token> all   = tokenRepository.findAll();
//        LocalDate   today = LocalDate.now();
//
//        long todayTotal = all.stream()
//                .filter(t -> t.getBookingDate().equals(today)).count();
//        long todayActive = all.stream()
//                .filter(t -> t.getBookingDate().equals(today)
//                        && (t.getStatus() == Token.TokenStatus.BOOKED
//                        ||  t.getStatus() == Token.TokenStatus.CALLED
//                        ||  t.getStatus() == Token.TokenStatus.IN_PROGRESS)).count();
//        long todayCompleted = all.stream()
//                .filter(t -> t.getBookingDate().equals(today)
//                        && t.getStatus() == Token.TokenStatus.COMPLETED).count();
//        long todayCancelled = all.stream()
//                .filter(t -> t.getBookingDate().equals(today)
//                        && t.getStatus() == Token.TokenStatus.CANCELLED).count();
//
//        List<RecentTokenResponse> recent = all.stream()
//                .filter(t -> t.getBookingDate().equals(today))
//                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
//                .limit(20)
//                .map(this::toRecentTokenResponse)
//                .collect(Collectors.toList());
//
//        return new TokenOverviewResponse(todayTotal, todayActive,
//                todayCompleted, todayCancelled, recent);
//    }
//
//    // ═══════════════════════════════════════════════════
//    // MAPPERS
//    // ═══════════════════════════════════════════════════
//
//    private BranchResponse toBranchResponse(Branch b) {
//        return new BranchResponse(
//                b.getId(),
//                b.getName(),
//                b.getLocation(),
//                b.getTime(),
//                b.getStatus(),
//                b.getCategory() != null ? b.getCategory().getId()   : null,
//                b.getCategory() != null ? b.getCategory().getName() : null
//        );
//    }
//
//    private AdminResponse toAdminResponse(User u) {
//        // FIX: fetch Branch from branchId instead of calling getBranch()
//        BranchResponse branchResp = null;
//        if (u.getBranchId() != null) {
//            branchResp = branchRepository.findById(u.getBranchId())
//                    .map(this::toBranchResponse)
//                    .orElse(null);
//        }
//        return new AdminResponse(
//                u.getId(),
//                u.getUsername(),
//                u.getEmail(),
//                u.getRole().name(),
//                branchResp
//        );
//    }
//
//    private UserResponse toUserResponse(User u) {
//        // FIX: use branchId (Long) — no getBranch() call needed
//        return new UserResponse(
//                u.getId(), u.getUsername(), u.getEmail(), u.getRole().name());
//    }
//
//    private RecentTokenResponse toRecentTokenResponse(Token t) {
//        String service = t.getQueueType() == Token.QueueType.DOCTOR
//                ? (t.getDoctor()        != null ? t.getDoctor().getName()        : "Doctor")
//                : (t.getBranchService() != null ? t.getBranchService().getName() : "Service");
//        return new RecentTokenResponse(
//                t.getId(),
//                t.getDisplayToken(),
//                t.getStatus().name(),
//                t.getUser()   != null ? t.getUser().getUsername()   : "Unknown",
//                t.getBranch() != null ? t.getBranch().getName()     : "Unknown",
//                service,
//                t.getBookingDate().toString()
//        );
//    }
//}
























package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.SuperAdminDTO.*;
import com.example.Queue_Master.entity.*;
import com.example.Queue_Master.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuperAdminService {

    private final UserRepository              userRepository;
    private final BranchRepository            branchRepository;
    private final ServiceCategoryRepository   categoryRepository;
    private final TokenRepository             tokenRepository;
    private final UserNotificationRepository  userNotificationRepository;
    private final PasswordEncoder             passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    // ═══════════════════════════════════════════════════
    // DASHBOARD STATS
    // ═══════════════════════════════════════════════════

    public DashboardStatsResponse getDashboardStats() {
        long totalBranches    = branchRepository.count();
        long totalAdmins      = userRepository.findByRole(Role.ADMIN).size();
        long totalUsers       = userRepository.findByRoleNot(Role.SUPER_ADMIN).size();
        long totalTokensToday = tokenRepository.findAll().stream()
                .filter(t -> t.getBookingDate().equals(LocalDate.now())).count();
        return new DashboardStatsResponse(totalBranches, totalAdmins, totalUsers, totalTokensToday);
    }

    // ═══════════════════════════════════════════════════
    // BRANCH MANAGEMENT
    // ═══════════════════════════════════════════════════

    public List<BranchResponse> getAllBranches() {
        return branchRepository.findAll().stream()
                .map(this::toBranchResponse).collect(Collectors.toList());
    }

    @Transactional
    public BranchResponse createBranch(CreateBranchRequest req) {
        ServiceCategory category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + req.getCategoryId()));
        Branch branch = new Branch();
        branch.setName(req.getName());
        branch.setLocation(req.getLocation());
        branch.setTime(req.getTiming());
        branch.setStatus(req.getStatus() != null ? req.getStatus() : "Open");
        branch.setCategory(category);
        return toBranchResponse(branchRepository.save(branch));
    }

    public boolean branchHasActiveTokens(Long branchId) {
        return tokenRepository.countActiveTokensByBranchId(branchId) > 0;
    }

    @Transactional
    public void deleteBranch(Long branchId) {
        branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found: " + branchId));

        // Step 1 — Delete notifications first
        // user_notifications.token_id references tokens.id — must go first
        userNotificationRepository.deleteNotificationsByBranchIdNative(branchId);

        // Step 2 — Delete all tokens via native SQL (covers all 3 FK paths)
        tokenRepository.deleteAllTokensByDoctorBranchIdNative(branchId);
        tokenRepository.deleteAllTokensByBranchServiceBranchIdNative(branchId);
        tokenRepository.deleteAllTokensByBranchIdNative(branchId);

        // Step 3 — Unlink admins from this branch
        userRepository.findByRole(Role.ADMIN).stream()
                .filter(a -> branchId.equals(a.getBranchId()))
                .forEach(a -> { a.setBranchId(null); userRepository.save(a); });

        // Step 4 — flush() + clear() JPA cache  ← THE KEY FIX
        // Native SQL deletes (steps 1-2) bypass JPA's 1st-level cache.
        // Without this, branchRepository.deleteById() triggers JPA cascade
        // which tries to re-manage already-deleted rows → FK violation → 400.
        // flush() sends any pending JPA writes to DB first.
        // clear() wipes the entity cache so JPA doesn't re-process deleted rows.
        entityManager.flush();
        entityManager.clear();

        // Step 5 — Delete branch (cascade removes doctors + branch_services cleanly)
        branchRepository.deleteById(branchId);
    }

    // ═══════════════════════════════════════════════════
    // ADMIN MANAGEMENT
    // ═══════════════════════════════════════════════════

    public List<AdminResponse> getAllAdmins() {
        return userRepository.findByRole(Role.ADMIN).stream()
                .map(this::toAdminResponse).collect(Collectors.toList());
    }

    @Transactional
    public AdminResponse createAdmin(CreateAdminRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already taken!");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered!");
        Branch branch = branchRepository.findById(req.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found: " + req.getBranchId()));
        User admin = new User();
        admin.setUsername(req.getUsername());
        admin.setEmail(req.getEmail());
        admin.setPassword(passwordEncoder.encode(req.getPassword()));
        admin.setRole(Role.ADMIN);
        admin.setBranchId(branch.getId());
        return toAdminResponse(userRepository.save(admin));
    }

    @Transactional
    public void deleteAdmin(Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + adminId));
        if (admin.getRole() != Role.ADMIN)
            throw new RuntimeException("User is not an ADMIN.");
        userRepository.delete(admin);
    }

    // ═══════════════════════════════════════════════════
    // USER MANAGEMENT
    // ═══════════════════════════════════════════════════

    public List<UserResponse> getAllUsers() {
        return userRepository.findByRoleNot(Role.SUPER_ADMIN).stream()
                .map(this::toUserResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        if (user.getRole() == Role.SUPER_ADMIN)
            throw new RuntimeException("Cannot delete Super Admin.");
        userRepository.delete(user);
    }

    @Transactional
    public UserResponse changeUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        if (user.getRole() == Role.SUPER_ADMIN)
            throw new RuntimeException("Cannot change Super Admin role.");
        try {
            user.setRole(Role.valueOf(newRole.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + newRole);
        }
        return toUserResponse(userRepository.save(user));
    }

    // ═══════════════════════════════════════════════════
    // TOKEN OVERVIEW
    // ═══════════════════════════════════════════════════

    public TokenOverviewResponse getTokenOverview() {
        List<Token> all   = tokenRepository.findAll();
        LocalDate   today = LocalDate.now();
        long todayTotal     = all.stream().filter(t -> t.getBookingDate().equals(today)).count();
        long todayActive    = all.stream().filter(t -> t.getBookingDate().equals(today)
                && (t.getStatus() == Token.TokenStatus.BOOKED
                ||  t.getStatus() == Token.TokenStatus.CALLED
                ||  t.getStatus() == Token.TokenStatus.IN_PROGRESS)).count();
        long todayCompleted = all.stream().filter(t -> t.getBookingDate().equals(today)
                && t.getStatus() == Token.TokenStatus.COMPLETED).count();
        long todayCancelled = all.stream().filter(t -> t.getBookingDate().equals(today)
                && t.getStatus() == Token.TokenStatus.CANCELLED).count();
        List<RecentTokenResponse> recent = all.stream()
                .filter(t -> t.getBookingDate().equals(today))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(20).map(this::toRecentTokenResponse).collect(Collectors.toList());
        return new TokenOverviewResponse(todayTotal, todayActive, todayCompleted, todayCancelled, recent);
    }

    // ═══════════════════════════════════════════════════
    // MAPPERS
    // ═══════════════════════════════════════════════════

    private BranchResponse toBranchResponse(Branch b) {
        return new BranchResponse(b.getId(), b.getName(), b.getLocation(), b.getTime(),
                b.getStatus(),
                b.getCategory() != null ? b.getCategory().getId()   : null,
                b.getCategory() != null ? b.getCategory().getName() : null);
    }

    private AdminResponse toAdminResponse(User u) {
        BranchResponse branchResp = null;
        if (u.getBranchId() != null)
            branchResp = branchRepository.findById(u.getBranchId())
                    .map(this::toBranchResponse).orElse(null);
        return new AdminResponse(u.getId(), u.getUsername(), u.getEmail(),
                u.getRole().name(), branchResp);
    }

    private UserResponse toUserResponse(User u) {
        return new UserResponse(u.getId(), u.getUsername(), u.getEmail(), u.getRole().name());
    }

    private RecentTokenResponse toRecentTokenResponse(Token t) {
        String service = t.getQueueType() == Token.QueueType.DOCTOR
                ? (t.getDoctor()        != null ? t.getDoctor().getName()        : "Doctor")
                : (t.getBranchService() != null ? t.getBranchService().getName() : "Service");
        return new RecentTokenResponse(t.getId(), t.getDisplayToken(), t.getStatus().name(),
                t.getUser()   != null ? t.getUser().getUsername()   : "Unknown",
                t.getBranch() != null ? t.getBranch().getName()     : "Unknown",
                service, t.getBookingDate().toString());
    }
}