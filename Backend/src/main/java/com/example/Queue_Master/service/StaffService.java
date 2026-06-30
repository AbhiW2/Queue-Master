package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.StaffDTO.*;
import com.example.Queue_Master.entity.*;
import com.example.Queue_Master.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final UserRepository          userRepository;
    private final DoctorRepository        doctorRepository;
    private final BranchServiceRepository branchServiceRepository;
    private final TokenRepository         tokenRepository;

    private static final long HOSPITAL_CATEGORY_ID = 1L;

    // ═══════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════

    private Branch getStaffBranch(String username) {
        User staff = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + username));
        if (staff.getBranch() == null)
            throw new RuntimeException("Staff is not assigned to any branch.");
        return staff.getBranch();
    }

    private boolean isHospital(Branch branch) {
        return branch.getCategory() != null &&
                branch.getCategory().getId() == HOSPITAL_CATEGORY_ID;
    }

    // ═══════════════════════════════════════════════════
    // BRANCH INFO
    // ═══════════════════════════════════════════════════

    public StaffBranchInfo getBranchInfo(String username) {
        Branch branch = getStaffBranch(username);
        return new StaffBranchInfo(
                branch.getId(),
                branch.getName(),
                branch.getStatus(),
                branch.getCategory() != null ? branch.getCategory().getId()   : null,
                branch.getCategory() != null ? branch.getCategory().getName() : null,
                isHospital(branch)
        );
    }

    // ═══════════════════════════════════════════════════
    // SELECTORS
    // ═══════════════════════════════════════════════════

    public List<DoctorOption> getDoctorOptions(String username) {
        Branch branch = getStaffBranch(username);
        if (!isHospital(branch))
            throw new RuntimeException("This branch does not have doctors.");
        return doctorRepository.findByBranch_Id(branch.getId()).stream()
                .map(d -> new DoctorOption(
                        d.getId(), d.getName(), d.getSpecialization(),
                        d.getTiming(), d.getStatus()))
                .collect(Collectors.toList());
    }

    public List<ServiceOption> getServiceOptions(String username) {
        Branch branch = getStaffBranch(username);
        if (isHospital(branch))
            throw new RuntimeException("Hospital branches use doctor queues.");
        return branchServiceRepository.findByBranch_Id(branch.getId()).stream()
                .map(s -> new ServiceOption(
                        s.getId(), s.getName(), s.getCounter(),
                        s.getTiming(), s.getStatus()))
                .collect(Collectors.toList());
    }

    // ═══════════════════════════════════════════════════
    // QUEUE — get today's tokens
    // ═══════════════════════════════════════════════════

    public List<QueueTokenItem> getDoctorQueue(String username, Long doctorId) {
        Branch branch = getStaffBranch(username);
        doctorRepository.findByIdAndBranch_Id(doctorId, branch.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Doctor not found in your branch."));

        return tokenRepository.findDoctorQueueForDate(doctorId, LocalDate.now())
                .stream()
                .sorted((a, b) -> Integer.compare(a.getTokenNumber(), b.getTokenNumber()))
                .map(t -> toQueueTokenItem(t, "DOCTOR"))
                .collect(Collectors.toList());
    }

    public List<QueueTokenItem> getServiceQueue(String username, Long serviceId) {
        Branch branch = getStaffBranch(username);
        branchServiceRepository.findByIdAndBranch_Id(serviceId, branch.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Service not found in your branch."));

        return tokenRepository.findBranchServiceQueueForDate(serviceId, LocalDate.now())
                .stream()
                .sorted((a, b) -> Integer.compare(a.getTokenNumber(), b.getTokenNumber()))
                .map(t -> toQueueTokenItem(t, "BRANCH_SERVICE"))
                .collect(Collectors.toList());
    }

    // ═══════════════════════════════════════════════════
    // STATS
    // ═══════════════════════════════════════════════════

    public QueueStats getDoctorQueueStats(String username, Long doctorId) {
        Branch branch = getStaffBranch(username);
        doctorRepository.findByIdAndBranch_Id(doctorId, branch.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Doctor not found in your branch."));

        List<Token> tokens = tokenRepository.findDoctorQueueForDate(
                doctorId, LocalDate.now());
        return buildStats(tokens, doctorId, true);
    }

    public QueueStats getServiceQueueStats(String username, Long serviceId) {
        Branch branch = getStaffBranch(username);
        branchServiceRepository.findByIdAndBranch_Id(serviceId, branch.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Service not found in your branch."));

        List<Token> tokens = tokenRepository.findBranchServiceQueueForDate(
                serviceId, LocalDate.now());
        return buildStats(tokens, serviceId, false);
    }

    private QueueStats buildStats(List<Token> tokens, Long id, boolean isDoctor) {
        long total     = tokens.size();
        long waiting   = tokens.stream()
                .filter(t -> t.getStatus() == Token.TokenStatus.BOOKED
                        || t.getStatus() == Token.TokenStatus.CALLED).count();
        long inProg    = tokens.stream()
                .filter(t -> t.getStatus() == Token.TokenStatus.IN_PROGRESS).count();
        long completed = tokens.stream()
                .filter(t -> t.getStatus() == Token.TokenStatus.COMPLETED).count();
        long cancelled = tokens.stream()
                .filter(t -> t.getStatus() == Token.TokenStatus.CANCELLED).count();

        String serving = isDoctor
                ? tokenRepository.findCurrentlyServingForDoctor(id, LocalDate.now())
                .map(Token::getDisplayToken).orElse("None")
                : tokenRepository.findCurrentlyServingForBranchService(id, LocalDate.now())
                .map(Token::getDisplayToken).orElse("None");

        return new QueueStats(total, waiting, inProg, completed, cancelled, serving);
    }

    // ═══════════════════════════════════════════════════
    // CALL NEXT
    // ═══════════════════════════════════════════════════

    @Transactional
    public CallNextResponse callNextDoctor(String username, Long doctorId) {
        Branch branch = getStaffBranch(username);
        doctorRepository.findByIdAndBranch_Id(doctorId, branch.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Doctor not found in your branch."));

        // Complete current IN_PROGRESS token first
        tokenRepository.findCurrentlyServingForDoctor(doctorId, LocalDate.now())
                .ifPresent(this::markCompleted);

        // Get next BOOKED token
        Token next = tokenRepository.findNextTokenForDoctor(doctorId, LocalDate.now())
                .orElseThrow(() -> new RuntimeException(
                        "No more tokens in queue for today."));

        next.setStatus(Token.TokenStatus.IN_PROGRESS);
        next.setServingStartedAt(LocalDateTime.now());
        Token saved = tokenRepository.save(next);

        return new CallNextResponse(
                saved.getId(),
                saved.getDisplayToken(),
                saved.getUser() != null ? saved.getUser().getUsername() : "Unknown",
                saved.getStatus().name(),
                "Now serving: " + saved.getDisplayToken()
        );
    }

    @Transactional
    public CallNextResponse callNextService(String username, Long serviceId) {
        Branch branch = getStaffBranch(username);
        branchServiceRepository.findByIdAndBranch_Id(serviceId, branch.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Service not found in your branch."));

        // Complete current IN_PROGRESS token first
        tokenRepository.findCurrentlyServingForBranchService(serviceId, LocalDate.now())
                .ifPresent(this::markCompleted);

        // Get next BOOKED token
        Token next = tokenRepository.findNextTokenForBranchService(serviceId, LocalDate.now())
                .orElseThrow(() -> new RuntimeException(
                        "No more tokens in queue for today."));

        next.setStatus(Token.TokenStatus.IN_PROGRESS);
        next.setServingStartedAt(LocalDateTime.now());
        Token saved = tokenRepository.save(next);

        return new CallNextResponse(
                saved.getId(),
                saved.getDisplayToken(),
                saved.getUser() != null ? saved.getUser().getUsername() : "Unknown",
                saved.getStatus().name(),
                "Now serving: " + saved.getDisplayToken()
        );
    }

    // ═══════════════════════════════════════════════════
    // UPDATE TOKEN STATUS (complete / no-show / skip)
    // ═══════════════════════════════════════════════════

    @Transactional
    public QueueTokenItem updateTokenStatus(String username, Long tokenId, String newStatus) {
        Branch branch = getStaffBranch(username);

        Token token = tokenRepository.findByIdWithDetails(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found: " + tokenId));

        // Verify token belongs to this staff's branch
        if (token.getBranch() == null ||
                !token.getBranch().getId().equals(branch.getId()))
            throw new RuntimeException("Token does not belong to your branch.");

        Token.TokenStatus status;
        try {
            status = Token.TokenStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + newStatus);
        }

        // Only allow these transitions
        if (status != Token.TokenStatus.COMPLETED &&
                status != Token.TokenStatus.NO_SHOW   &&
                status != Token.TokenStatus.SKIPPED)
            throw new RuntimeException(
                    "Staff can only set: COMPLETED, NO_SHOW, SKIPPED");

        token.setStatus(status);

        if (status == Token.TokenStatus.COMPLETED) {
            token.setServingCompletedAt(LocalDateTime.now());
            if (token.getServingStartedAt() != null) {
                long actual = Duration.between(
                        token.getServingStartedAt(), LocalDateTime.now()).toMinutes();
                token.setActualWaitTimeMinutes((int) actual);
            }
        }

        Token saved = tokenRepository.save(token);
        return toQueueTokenItem(saved,
                saved.getQueueType() == Token.QueueType.DOCTOR
                        ? "DOCTOR" : "BRANCH_SERVICE");
    }

    // ═══════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════

    private void markCompleted(Token token) {
        token.setStatus(Token.TokenStatus.COMPLETED);
        token.setServingCompletedAt(LocalDateTime.now());
        if (token.getServingStartedAt() != null) {
            long actual = Duration.between(
                    token.getServingStartedAt(), LocalDateTime.now()).toMinutes();
            token.setActualWaitTimeMinutes((int) actual);
        }
        tokenRepository.save(token);
    }

    private QueueTokenItem toQueueTokenItem(Token t, String queueType) {
        String service = queueType.equals("DOCTOR")
                ? (t.getDoctor()        != null ? "Dr. " + t.getDoctor().getName() : "Doctor")
                : (t.getBranchService() != null ? t.getBranchService().getName()   : "Service");
        return new QueueTokenItem(
                t.getId(),
                t.getDisplayToken(),
                t.getTokenNumber(),
                t.getStatus().name(),
                t.getUser() != null ? t.getUser().getUsername() : "Unknown",
                t.getBookingDate().toString(),
                service,
                queueType
        );
    }
}