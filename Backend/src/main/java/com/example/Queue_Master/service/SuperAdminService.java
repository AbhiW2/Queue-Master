package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.SuperAdminDTO.*;
import com.example.Queue_Master.entity.*;
import com.example.Queue_Master.repository.*;
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

    private final UserRepository            userRepository;
    private final BranchRepository          branchRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final TokenRepository           tokenRepository;
    private final PasswordEncoder           passwordEncoder;

    // ═══════════════════════════════════════════════════
    // DASHBOARD STATS
    // ═══════════════════════════════════════════════════

    public DashboardStatsResponse getDashboardStats() {
        long totalBranches    = branchRepository.count();
        long totalAdmins      = userRepository.findByRole(Role.ADMIN).size();
        long totalUsers       = userRepository.findByRoleNot(Role.SUPER_ADMIN).size();
        long totalTokensToday = tokenRepository.findAll().stream()
                .filter(t -> t.getBookingDate().equals(LocalDate.now()))
                .count();

        return new DashboardStatsResponse(totalBranches, totalAdmins,
                totalUsers, totalTokensToday);
    }

    // ═══════════════════════════════════════════════════
    // BRANCH MANAGEMENT
    // ═══════════════════════════════════════════════════

    public List<BranchResponse> getAllBranches() {
        return branchRepository.findAll().stream()
                .map(this::toBranchResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BranchResponse createBranch(CreateBranchRequest req) {
        ServiceCategory category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException(
                        "Category not found: " + req.getCategoryId()));

        Branch branch = new Branch();
        branch.setName(req.getName());
        branch.setLocation(req.getLocation());
        branch.setTime(req.getTiming());
        branch.setStatus(req.getStatus() != null ? req.getStatus() : "Open");
        branch.setCategory(category);

        return toBranchResponse(branchRepository.save(branch));
    }

    // ✅ ADDED: called by SuperAdminController GET /branches/{id}/has-active-tokens
    public boolean branchHasActiveTokens(Long branchId) {
        return tokenRepository.countActiveTokensByBranchId(branchId) > 0;
    }

    @Transactional
    public void deleteBranch(Long branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException(
                        "Branch not found: " + branchId));

        // Step 1 ── Delete all tokens for this branch first
        List<Token> tokens = tokenRepository.findByBranch_Id(branchId);
        if (!tokens.isEmpty()) {
            tokenRepository.deleteAll(tokens);
            tokenRepository.flush();
        }

        // Step 2 ── Unlink admins assigned to this branch
        userRepository.findByRole(Role.ADMIN).stream()
                .filter(a -> a.getBranch() != null
                        && a.getBranch().getId().equals(branchId))
                .forEach(a -> {
                    a.setBranch(null);
                    userRepository.save(a);
                });

        // Step 3 ── Delete branch (cascades to doctors + services)
        branchRepository.delete(branch);
    }

    // ═══════════════════════════════════════════════════
    // ADMIN MANAGEMENT
    // ═══════════════════════════════════════════════════

    public List<AdminResponse> getAllAdmins() {
        return userRepository.findByRole(Role.ADMIN).stream()
                .map(this::toAdminResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminResponse createAdmin(CreateAdminRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already taken!");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered!");

        Branch branch = branchRepository.findById(req.getBranchId())
                .orElseThrow(() -> new RuntimeException(
                        "Branch not found: " + req.getBranchId()));

        User admin = new User();
        admin.setUsername(req.getUsername());
        admin.setEmail(req.getEmail());
        admin.setPassword(passwordEncoder.encode(req.getPassword()));
        admin.setRole(Role.ADMIN);
        admin.setBranch(branch);

        return toAdminResponse(userRepository.save(admin));
    }

    @Transactional
    public void deleteAdmin(Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException(
                        "Admin not found: " + adminId));
        if (admin.getRole() != Role.ADMIN)
            throw new RuntimeException("User is not an ADMIN.");
        userRepository.delete(admin);
    }

    // ═══════════════════════════════════════════════════
    // USER MANAGEMENT
    // ═══════════════════════════════════════════════════

    public List<UserResponse> getAllUsers() {
        return userRepository.findByRoleNot(Role.SUPER_ADMIN).stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "User not found: " + userId));
        if (user.getRole() == Role.SUPER_ADMIN)
            throw new RuntimeException("Cannot delete Super Admin.");
        userRepository.delete(user);
    }

    @Transactional
    public UserResponse changeUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "User not found: " + userId));
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

        long todayTotal = all.stream()
                .filter(t -> t.getBookingDate().equals(today)).count();
        long todayActive = all.stream()
                .filter(t -> t.getBookingDate().equals(today)
                        && (t.getStatus() == Token.TokenStatus.BOOKED
                        ||  t.getStatus() == Token.TokenStatus.CALLED
                        ||  t.getStatus() == Token.TokenStatus.IN_PROGRESS)).count();
        long todayCompleted = all.stream()
                .filter(t -> t.getBookingDate().equals(today)
                        && t.getStatus() == Token.TokenStatus.COMPLETED).count();
        long todayCancelled = all.stream()
                .filter(t -> t.getBookingDate().equals(today)
                        && t.getStatus() == Token.TokenStatus.CANCELLED).count();

        List<RecentTokenResponse> recent = all.stream()
                .filter(t -> t.getBookingDate().equals(today))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(20)
                .map(this::toRecentTokenResponse)
                .collect(Collectors.toList());

        return new TokenOverviewResponse(todayTotal, todayActive,
                todayCompleted, todayCancelled, recent);
    }

    // ═══════════════════════════════════════════════════
    // MAPPERS
    // ═══════════════════════════════════════════════════

    private BranchResponse toBranchResponse(Branch b) {
        return new BranchResponse(
                b.getId(),
                b.getName(),
                b.getLocation(),
                b.getTime(),
                b.getStatus(),
                b.getCategory() != null ? b.getCategory().getId()   : null,
                b.getCategory() != null ? b.getCategory().getName() : null
        );
    }

    private AdminResponse toAdminResponse(User u) {
        return new AdminResponse(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getRole().name(),
                u.getBranch() != null ? toBranchResponse(u.getBranch()) : null
        );
    }

    private UserResponse toUserResponse(User u) {
        return new UserResponse(
                u.getId(), u.getUsername(), u.getEmail(), u.getRole().name());
    }

    private RecentTokenResponse toRecentTokenResponse(Token t) {
        String service = t.getQueueType() == Token.QueueType.DOCTOR
                ? (t.getDoctor()        != null ? t.getDoctor().getName()        : "Doctor")
                : (t.getBranchService() != null ? t.getBranchService().getName() : "Service");
        return new RecentTokenResponse(
                t.getId(),
                t.getDisplayToken(),
                t.getStatus().name(),
                t.getUser()   != null ? t.getUser().getUsername()   : "Unknown",
                t.getBranch() != null ? t.getBranch().getName()     : "Unknown",
                service,
                t.getBookingDate().toString()
        );
    }
}