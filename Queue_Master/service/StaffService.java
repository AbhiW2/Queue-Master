

package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.TokenResponse;
import com.example.Queue_Master.entity.*;
import com.example.Queue_Master.entity.Token.TokenStatus;
import com.example.Queue_Master.exception.BadRequestException;
import com.example.Queue_Master.exception.ResourceNotFoundException;
import com.example.Queue_Master.exception.TokenBookingException;
import com.example.Queue_Master.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StaffService {

    private final UserRepository          userRepository;
    private final BranchRepository        branchRepository;
    private final DoctorRepository        doctorRepository;
    private final BranchServiceRepository branchServiceRepository;
    private final TokenRepository         tokenRepository;

    // ── Branch Info ───────────────────────────────────────────────

    public Map<String, Object> getBranchInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Branch branch = findStaffBranch(user);

        if (branch == null) {
            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("branchId",   null);
            resp.put("branchName", "Unassigned");
            resp.put("isHospital", false);
            resp.put("location",   "");
            return resp;
        }

        String catCode   = branch.getCategory() != null
                ? branch.getCategory().getCode().toUpperCase() : "";
        boolean isHospital = catCode.equals("HOSP") || catCode.equals("HOSPITAL");

        // Smart detect: if not flagged as hospital but has doctors, treat as hospital
        if (!isHospital) {
            long doctorCount = doctorRepository.findByBranch_Id(branch.getId()).size();
            if (doctorCount > 0) isHospital = true;
        }

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("branchId",   branch.getId());
        resp.put("branchName", branch.getName());
        resp.put("isHospital", isHospital);
        resp.put("location",   branch.getLocation() != null ? branch.getLocation() : "");
        return resp;
    }

    // ── Doctors & Services ────────────────────────────────────────

    public List<Map<String, Object>> getDoctors(String username) {
        User   user   = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Branch branch = findStaffBranch(user);
        if (branch == null) return Collections.emptyList();

        return doctorRepository.findByBranch_Id(branch.getId()).stream()
                .map(d -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",             d.getId());
                    m.put("name",           d.getName());
                    m.put("specialization", d.getSpecialization());
                    m.put("timing",         d.getTiming());
                    m.put("status",         d.getStatus());
                    m.put("counter",        null);
                    return m;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getServices(String username) {
        User   user   = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Branch branch = findStaffBranch(user);
        if (branch == null) return Collections.emptyList();

        return branchServiceRepository.findByBranch_Id(branch.getId()).stream()
                .map(s -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",      s.getId());
                    m.put("name",    s.getName());
                    m.put("counter", s.getCounter());
                    m.put("timing",  s.getTiming());
                    m.put("status",  s.getStatus());
                    return m;
                })
                .collect(Collectors.toList());
    }

    // ── Queue Lists ───────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getDoctorQueue(Long doctorId, LocalDate date) {
        return tokenRepository.findDoctorQueueForDate(doctorId, date)
                .stream().map(this::tokenToMap).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getServiceQueue(Long serviceId, LocalDate date) {
        return tokenRepository.findBranchServiceQueueForDate(serviceId, date)
                .stream().map(this::tokenToMap).collect(Collectors.toList());
    }

    // ── Stats ─────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, Object> getDoctorStats(Long doctorId, LocalDate date) {
        List<Token> queue = tokenRepository.findDoctorQueueForDate(doctorId, date);
        return buildStats(queue, doctorId, date, true);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getServiceStats(Long serviceId, LocalDate date) {
        List<Token> queue = tokenRepository.findBranchServiceQueueForDate(serviceId, date);
        return buildStats(queue, serviceId, date, false);
    }

    private Map<String, Object> buildStats(List<Token> queue, Long id,
                                           LocalDate date, boolean isDoctor) {
        long waiting   = queue.stream().filter(t -> t.getStatus() == TokenStatus.BOOKED).count();
        long inProg    = queue.stream().filter(t -> t.getStatus() == TokenStatus.IN_PROGRESS).count();
        long completed = queue.stream().filter(t -> t.getStatus() == TokenStatus.COMPLETED).count();
        long skipped   = queue.stream().filter(t -> t.getStatus() == TokenStatus.SKIPPED).count();
        long noShow    = queue.stream().filter(t -> t.getStatus() == TokenStatus.NO_SHOW).count();
        long cancelled = queue.stream().filter(t -> t.getStatus() == TokenStatus.CANCELLED).count();

        String serving = isDoctor
                ? tokenRepository.findCurrentlyServingForDoctor(id, date)
                  .map(Token::getDisplayToken).orElse("—")
                : tokenRepository.findCurrentlyServingForBranchService(id, date)
                  .map(Token::getDisplayToken).orElse("—");

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("totalToday",       queue.size());
        m.put("waiting",          waiting);
        m.put("inProgress",       inProg);
        m.put("completed",        completed);
        m.put("skipped",          skipped);
        m.put("noShow",           noShow);
        m.put("cancelled",        cancelled);
        m.put("currentlyServing", serving);
        return m;
    }

    // ── Call Next ─────────────────────────────────────────────────

    @Transactional
    public TokenResponse callNextDoctor(Long doctorId, LocalDate date) {
        // Complete whoever is currently IN_PROGRESS first
        tokenRepository.findCurrentlyServingForDoctor(doctorId, date)
                .ifPresent(this::completeToken);

        Token next = tokenRepository.findNextTokenForDoctor(doctorId, date)
                .orElseThrow(() -> new TokenBookingException(
                        "No more patients waiting in queue."));

        next.setStatus(TokenStatus.IN_PROGRESS);
        next.setServingStartedAt(LocalDateTime.now());
        Token saved = tokenRepository.save(next);
        return buildTokenResponse(
                tokenRepository.findByIdWithDetails(saved.getId()).orElse(saved));
    }

    @Transactional
    public TokenResponse callNextService(Long serviceId, LocalDate date) {
        tokenRepository.findCurrentlyServingForBranchService(serviceId, date)
                .ifPresent(this::completeToken);

        Token next = tokenRepository.findNextTokenForBranchService(serviceId, date)
                .orElseThrow(() -> new TokenBookingException(
                        "No more tokens waiting in queue."));

        next.setStatus(TokenStatus.IN_PROGRESS);
        next.setServingStartedAt(LocalDateTime.now());
        Token saved = tokenRepository.save(next);
        return buildTokenResponse(
                tokenRepository.findByIdWithDetails(saved.getId()).orElse(saved));
    }

    // ── Update Token Status ───────────────────────────────────────
    // COMPLETED → Mark Served
    // SKIPPED   → Skip (patient loses turn)
    // NO_SHOW   → No Show (patient absent)
    // BOOKED    → Hold (re-queue at end)

    @Transactional
    public TokenResponse updateTokenStatus(Long tokenId, String statusStr) {
        if (statusStr == null || statusStr.isBlank())
            throw new BadRequestException("Status must not be blank.");

        Token token = tokenRepository.findByIdWithDetails(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found: " + tokenId));

        TokenStatus newStatus;
        try {
            newStatus = TokenStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + statusStr);
        }

        TokenStatus current = token.getStatus();

        switch (newStatus) {

            case COMPLETED -> {
                if (current != TokenStatus.IN_PROGRESS)
                    throw new BadRequestException(
                            "Can only mark served when IN_PROGRESS. Current: " + current);
                completeToken(token);
                log.info("Token {} marked COMPLETED", token.getDisplayToken());
            }

            case SKIPPED -> {
                if (current != TokenStatus.IN_PROGRESS && current != TokenStatus.BOOKED)
                    throw new BadRequestException(
                            "Can only skip BOOKED or IN_PROGRESS token. Current: " + current);
                token.setStatus(TokenStatus.SKIPPED);
                token.setServingCompletedAt(LocalDateTime.now());
                tokenRepository.save(token);
                log.info("Token {} SKIPPED", token.getDisplayToken());
            }

            case NO_SHOW -> {
                if (current == TokenStatus.COMPLETED || current == TokenStatus.CANCELLED)
                    throw new BadRequestException(
                            "Cannot mark NO_SHOW: token already " + current);
                token.setStatus(TokenStatus.NO_SHOW);
                token.setServingCompletedAt(LocalDateTime.now());
                tokenRepository.save(token);
                log.info("Token {} NO_SHOW", token.getDisplayToken());
            }

            case BOOKED -> {
                // HOLD — put token back at end of queue
                if (current != TokenStatus.BOOKED && current != TokenStatus.IN_PROGRESS)
                    throw new BadRequestException(
                            "Can only hold BOOKED or IN_PROGRESS token. Current: " + current);
                holdToken(token);
                log.info("Token {} HELD (moved to end of queue)", token.getDisplayToken());
            }

            default -> throw new BadRequestException(
                    "Staff cannot set status to: " + newStatus);
        }

        return buildTokenResponse(
                tokenRepository.findByIdWithDetails(tokenId).orElse(token));
    }

    // ── Private Helpers ───────────────────────────────────────────

    private void completeToken(Token token) {
        token.setStatus(TokenStatus.COMPLETED);
        token.setServingCompletedAt(LocalDateTime.now());
        if (token.getServingStartedAt() != null) {
            long actual = Duration.between(
                    token.getServingStartedAt(), LocalDateTime.now()).toMinutes();
            token.setActualWaitTimeMinutes((int) actual);
        }
        tokenRepository.save(token);
    }

    /** HOLD: move token to end of today's queue by assigning a new higher token number. */
    private void holdToken(Token token) {
        token.setStatus(TokenStatus.BOOKED);
        token.setServingStartedAt(null);

        int maxNum;
        if (token.getQueueType() == Token.QueueType.DOCTOR && token.getDoctor() != null) {
            maxNum = tokenRepository
                    .findMaxTokenNumberByDoctorAndDate(
                            token.getDoctor().getId(), token.getBookingDate())
                    .orElse(token.getTokenNumber());
        } else if (token.getBranchService() != null) {
            maxNum = tokenRepository
                    .findMaxTokenNumberByBranchServiceAndDate(
                            token.getBranchService().getId(), token.getBookingDate())
                    .orElse(token.getTokenNumber());
        } else {
            maxNum = token.getTokenNumber();
        }

        int    newNumber   = maxNum + 1;
        String prefix      = token.getDisplayToken().replaceAll("\\d+$", "");
        String newDisplay  = prefix + String.format("%03d", newNumber);

        token.setTokenNumber(newNumber);
        token.setDisplayToken(newDisplay);
        tokenRepository.save(token);
    }

    /** Convert a Token entity → flat map the frontend queue list expects. */
    private Map<String, Object> tokenToMap(Token t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("tokenId",      t.getId());
        m.put("displayToken", t.getDisplayToken());
        m.put("tokenNumber",  t.getTokenNumber());
        m.put("status",       t.getStatus() != null ? t.getStatus().name() : null);
        m.put("queueType",    t.getQueueType() != null ? t.getQueueType().name() : null);
        m.put("bookingDate",  t.getBookingDate() != null ? t.getBookingDate().toString() : null);
        m.put("bookedAt",     t.getCreatedAt()  != null ? t.getCreatedAt().toString()  : null);

        if (t.getUser() != null) {
            m.put("customerName",  t.getUser().getUsername());
            m.put("customerEmail", t.getUser().getEmail());
        } else {
            m.put("customerName",  "—");
            m.put("customerEmail", "");
        }

        if (t.getDoctor() != null) {
            m.put("serviceName", "Dr. " + t.getDoctor().getName());
            m.put("doctorId",    t.getDoctor().getId());
        } else if (t.getBranchService() != null) {
            m.put("serviceName",    t.getBranchService().getName());
            m.put("serviceCounter", t.getBranchService().getCounter());
        } else {
            m.put("serviceName", "—");
        }

        m.put("estimatedWait", t.getEstimatedWaitTimeMinutes());
        return m;
    }

    private TokenResponse buildTokenResponse(Token token) {
        TokenResponse.TokenResponseBuilder b = TokenResponse.builder()
                .tokenId(token.getId())
                .displayToken(token.getDisplayToken())
                .tokenNumber(token.getTokenNumber())
                .status(token.getStatus())
                .queueType(token.getQueueType())
                .bookingDate(token.getBookingDate())
                .bookedAt(token.getCreatedAt());

        if (token.getDoctor()        != null) {
            b.doctorId(token.getDoctor().getId())
                    .doctorName(token.getDoctor().getName());
        }
        if (token.getBranchService() != null) {
            b.branchServiceId(token.getBranchService().getId())
                    .branchServiceName(token.getBranchService().getName())
                    .branchServiceCounter(token.getBranchService().getCounter());
        }
        if (token.getBranch()        != null) {
            b.branchId(token.getBranch().getId())
                    .branchName(token.getBranch().getName());
        }
        if (token.getUser()          != null) {
            b.userId(token.getUser().getId())
                    .userName(token.getUser().getUsername());
        }
        return b.build();
    }

    /**
     * Derive which branch a staff member belongs to.
     * Uses the branch with the most active tokens today — most relevant for staff.
     * NOTE: If you add a branchId FK to User later, replace this with user.getBranch().
     */
    private Branch findStaffBranch(User user) {
        List<Branch> all = branchRepository.findAll();
        if (all.isEmpty()) return null;

        LocalDate today = LocalDate.now();
        return all.stream()
                .max(Comparator.comparingLong(b -> {
                    long docTokens = doctorRepository.findByBranch_Id(b.getId()).stream()
                            .mapToLong(d -> tokenRepository
                                    .findDoctorQueueForDate(d.getId(), today).size())
                            .sum();
                    long svcTokens = branchServiceRepository.findByBranch_Id(b.getId()).stream()
                            .mapToLong(s -> tokenRepository
                                    .findBranchServiceQueueForDate(s.getId(), today).size())
                            .sum();
                    return docTokens + svcTokens;
                }))
                .orElse(all.get(0));
    }
}
