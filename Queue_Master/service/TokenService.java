//package com.example.Queue_Master.service;
//
//import com.example.Queue_Master.dto.QueueStatusResponse;
//import com.example.Queue_Master.dto.TokenRequest;
//import com.example.Queue_Master.dto.TokenResponse;
//import com.example.Queue_Master.entity.Branch;
//import com.example.Queue_Master.entity.BranchService;
//import com.example.Queue_Master.entity.Doctor;
//import com.example.Queue_Master.entity.Token;
//import com.example.Queue_Master.entity.Token.QueueType;
//import com.example.Queue_Master.entity.Token.TokenStatus;
//import com.example.Queue_Master.entity.User;
//import com.example.Queue_Master.exception.ResourceNotFoundException;
//import com.example.Queue_Master.exception.TokenBookingException;
//import com.example.Queue_Master.repository.BranchServiceRepository;
//import com.example.Queue_Master.repository.DoctorRepository;
//import com.example.Queue_Master.repository.TokenRepository;
//import com.example.Queue_Master.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.dao.DataIntegrityViolationException;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Isolation;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.Duration;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.LocalTime;
//import java.time.format.DateTimeFormatter;
//import java.util.ArrayList;
//import java.util.List;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class TokenService {
//
//    private final TokenRepository         tokenRepository;
//    private final UserRepository          userRepository;
//    private final DoctorRepository        doctorRepository;
//    private final BranchServiceRepository branchServiceRepository;
//    private final UserNotificationService notificationService;
//
//    // =========================================================================
//    // BOOK TOKEN — entry point
//    // =========================================================================
//
//    @Transactional
//    public TokenResponse bookToken(TokenRequest request) {
//        validateBookingDate(request.getBookingDate());
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUserId()));
//        return switch (request.getQueueType()) {
//            case DOCTOR         -> bookDoctorToken(request, user);
//            case BRANCH_SERVICE -> bookBranchServiceToken(request, user);
//        };
//    }
//
//    // =========================================================================
//    // BOOK — DOCTOR
//    // =========================================================================
//
//    @Transactional(isolation = Isolation.SERIALIZABLE)
//    public TokenResponse bookDoctorToken(TokenRequest request, User user) {
//
//        Doctor doctor = doctorRepository.findById(request.getDoctorId())
//                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + request.getDoctorId()));
//
//        if (!"Available".equalsIgnoreCase(doctor.getStatus()))
//            throw new TokenBookingException("Dr. " + doctor.getName() + " is not available.");
//
//        validateServiceTiming(doctor.getTiming(), "Dr. " + doctor.getName());
//        validateBookingTime(request.getBookingDate(), request.getBookingTime(), "Dr. " + doctor.getName());
//
//        boolean alreadyBooked = tokenRepository.existsActiveTokenForUserAndDoctor(
//                user.getId(), doctor.getId(), request.getBookingDate());
//        if (alreadyBooked)
//            throw new TokenBookingException(
//                    "You already have an active token for Dr. " + doctor.getName()
//                            + " on " + request.getBookingDate() + ".");
//
//        if (request.getBookingTime() != null)
//            validateUserOneHourCooldown(user.getId(), request.getBookingDate(),
//                    request.getBookingTime(), null);
//
//        tokenRepository.lockDoctorQueueForDate(doctor.getId(), request.getBookingDate());
//
//        int avgTime = doctor.getAvgConsultationTime() > 0 ? doctor.getAvgConsultationTime() : 10;
//
//        LocalTime scheduledTime = resolveAndLockSlot(
//                request.getBookingTime(), doctor.getTiming(),
//                doctor.getId(), null,
//                request.getBookingDate(), avgTime,
//                "Dr. " + doctor.getName());
//
//        int nextNumber    = tokenRepository.findMaxTokenNumberByDoctorAndDate(
//                doctor.getId(), request.getBookingDate()).map(m -> m + 1).orElse(1);
//        int tokensAhead   = tokenRepository.countActiveTokensAheadForDoctor(
//                doctor.getId(), request.getBookingDate(), nextNumber);
//        int estimatedWait = tokensAhead * avgTime;
//
//        Token token = Token.builder()
//                .tokenNumber(nextNumber)
//                .displayToken(buildDisplayToken("D", nextNumber))
//                .bookingDate(request.getBookingDate())
//                .status(TokenStatus.BOOKED)
//                .queueType(QueueType.DOCTOR)
//                .user(user).doctor(doctor).branch(doctor.getBranch())
//                .scheduledTime(scheduledTime)
//                .slotEndTime(scheduledTime != null ? scheduledTime.plusMinutes(avgTime) : null)
//                .slotDurationMinutes(avgTime)
//                .estimatedWaitTimeMinutes(estimatedWait)
//                .build();
//
//        Token saved;
//        try {
//            saved = tokenRepository.saveAndFlush(token);
//        } catch (DataIntegrityViolationException e) {
//            throw new TokenBookingException(
//                    "The " + formatTime(scheduledTime) + " slot for Dr. " + doctor.getName()
//                            + " on " + request.getBookingDate()
//                            + " was just taken. Please select a different time.");
//        }
//
//        log.info("Doctor token booked: {}, slot={}, wait={}min", saved.getDisplayToken(), scheduledTime, estimatedWait);
//        notificationService.notifyTokenBooked(saved);
//        return buildDoctorResponse(saved, tokensAhead);
//    }
//
//    // =========================================================================
//    // BOOK — BRANCH SERVICE
//    // =========================================================================
//
//    @Transactional(isolation = Isolation.SERIALIZABLE)
//    public TokenResponse bookBranchServiceToken(TokenRequest request, User user) {
//
//        BranchService bs = branchServiceRepository.findById(request.getBranchServiceId())
//                .orElseThrow(() -> new ResourceNotFoundException("Branch service not found: " + request.getBranchServiceId()));
//
//        if (!"Available".equalsIgnoreCase(bs.getStatus()))
//            throw new TokenBookingException("Service '" + bs.getName() + "' is unavailable.");
//
//        validateServiceTiming(bs.getTiming(), bs.getName());
//        validateBookingTime(request.getBookingDate(), request.getBookingTime(), bs.getName());
//
//        boolean alreadyBooked = tokenRepository.existsActiveTokenForUserAndBranchService(
//                user.getId(), bs.getId(), request.getBookingDate());
//        if (alreadyBooked)
//            throw new TokenBookingException(
//                    "You already have an active token for '" + bs.getName()
//                            + "' on " + request.getBookingDate() + ".");
//
//        if (request.getBookingTime() != null)
//            validateUserOneHourCooldown(user.getId(), request.getBookingDate(),
//                    request.getBookingTime(), null);
//
//        tokenRepository.lockBranchServiceQueueForDate(bs.getId(), request.getBookingDate());
//
//        int avgTime = bs.getAvgServiceTimeMinutes() != null && bs.getAvgServiceTimeMinutes() > 0
//                ? bs.getAvgServiceTimeMinutes() : 10;
//
//        LocalTime scheduledTime = resolveAndLockSlot(
//                request.getBookingTime(), bs.getTiming(),
//                null, bs.getId(),
//                request.getBookingDate(), avgTime,
//                bs.getName());
//
//        String prefix  = getPrefixFromCategory(bs.getBranch());
//        int nextNumber = tokenRepository.findMaxTokenNumberByBranchServiceAndDate(
//                bs.getId(), request.getBookingDate()).map(m -> m + 1).orElse(1);
//        int tokensAhead   = tokenRepository.countActiveTokensAheadForBranchService(
//                bs.getId(), request.getBookingDate(), nextNumber);
//        int estimatedWait = tokensAhead * avgTime;
//
//        Token token = Token.builder()
//                .tokenNumber(nextNumber)
//                .displayToken(buildDisplayToken(prefix, nextNumber))
//                .bookingDate(request.getBookingDate())
//                .status(TokenStatus.BOOKED)
//                .queueType(QueueType.BRANCH_SERVICE)
//                .user(user).branchService(bs).branch(bs.getBranch())
//                .scheduledTime(scheduledTime)
//                .slotEndTime(scheduledTime != null ? scheduledTime.plusMinutes(avgTime) : null)
//                .slotDurationMinutes(avgTime)
//                .estimatedWaitTimeMinutes(estimatedWait)
//                .build();
//
//        Token saved;
//        try {
//            saved = tokenRepository.saveAndFlush(token);
//        } catch (DataIntegrityViolationException e) {
//            throw new TokenBookingException(
//                    "The " + formatTime(scheduledTime) + " slot for " + bs.getName()
//                            + " on " + request.getBookingDate()
//                            + " was just taken. Please select a different time.");
//        }
//
//        log.info("Branch service token booked: {}, slot={}, wait={}min", saved.getDisplayToken(), scheduledTime, estimatedWait);
//        notificationService.notifyTokenBooked(saved);
//        return buildBranchServiceResponse(saved, tokensAhead);
//    }
//
//    // =========================================================================
//    // RULE 1 — SLOT WINDOW BLOCKING
//    // =========================================================================
//
//    private void checkSlotWindowConflict(
//            LocalTime requestedTime, List<Token> existingTokens,
//            String serviceName, LocalDate date, String timing, int avgTime) {
//
//        for (Token existing : existingTokens) {
//            LocalTime slotStart = existing.getScheduledTime();
//            int duration = existing.getSlotDurationMinutes() != null
//                    ? existing.getSlotDurationMinutes() : avgTime;
//            LocalTime slotEnd = slotStart.plusMinutes(duration);
//            boolean overlaps = !requestedTime.isBefore(slotStart) && requestedTime.isBefore(slotEnd);
//            if (overlaps) {
//                String available = buildAvailableSlotsMessage(existingTokens, timing, avgTime);
//                throw new TokenBookingException(
//                        "The " + formatTime(requestedTime) + " slot for " + serviceName
//                                + " on " + date + " is already taken "
//                                + "(slot window: " + formatTime(slotStart) + " – " + formatTime(slotEnd) + "). "
//                                + available);
//            }
//        }
//    }
//
//    private String buildAvailableSlotsMessage(List<Token> existingTokens, String timing, int avgTime) {
//        LocalTime openTime  = parseOpenTime(timing);
//        LocalTime closeTime = parseCloseTime(timing);
//        if (openTime == null || closeTime == null) return "";
//
//        List<LocalTime[]> occupied = new ArrayList<>();
//        for (Token t : existingTokens) {
//            if (t.getScheduledTime() != null) {
//                int dur = t.getSlotDurationMinutes() != null ? t.getSlotDurationMinutes() : avgTime;
//                occupied.add(new LocalTime[]{t.getScheduledTime(), t.getScheduledTime().plusMinutes(dur)});
//            }
//        }
//
//        List<String> freeSlots = new ArrayList<>();
//        LocalTime cursor = openTime;
//        while (!cursor.isAfter(closeTime.minusMinutes(avgTime))) {
//            LocalTime windowEnd = cursor.plusMinutes(avgTime);
//            boolean free = true;
//            for (LocalTime[] occ : occupied) {
//                if (!(windowEnd.compareTo(occ[0]) <= 0 || cursor.compareTo(occ[1]) >= 0)) {
//                    free = false; break;
//                }
//            }
//            if (free) freeSlots.add(formatTime(cursor));
//            cursor = cursor.plusMinutes(avgTime);
//        }
//
//        if (freeSlots.isEmpty()) return "No available slots remain for this day.";
//        return "Available slots: " + String.join(", ", freeSlots) + ".";
//    }
//
//    // =========================================================================
//    // RULE 2 — USER 1-HOUR COOLDOWN
//    // =========================================================================
//
//    private void validateUserOneHourCooldown(
//            Long userId, LocalDate date, LocalTime newTime, Long excludeTokenId) {
//
//        List<Token> userTokens = tokenRepository.findActiveTokensForUserOnDate(userId, date);
//
//        for (Token existing : userTokens) {
//            if (excludeTokenId != null && existing.getId().equals(excludeTokenId)) continue;
//            if (existing.getScheduledTime() == null) continue;
//
//            LocalTime existingTime = existing.getScheduledTime();
//            long diffMinutes = Math.abs(Duration.between(existingTime, newTime).toMinutes());
//
//            if (existing.getQueueType() == QueueType.DOCTOR && diffMinutes < 60) {
//                String existingDesc = existing.getDoctor() != null
//                        ? "Dr. " + existing.getDoctor().getName() : "a doctor";
//                throw new TokenBookingException(
//                        "You already have a doctor appointment at " + formatTime(existingTime)
//                                + " (" + existingDesc + "). "
//                                + "You cannot book another service within 1 hour of a doctor appointment. "
//                                + "Next available window: " + formatTime(existingTime.plusMinutes(60)) + ". "
//                                + "Please cancel your current token first if you wish to book at this time.");
//            }
//        }
//    }
//
//    // =========================================================================
//    // resolveAndLockSlot
//    // =========================================================================
//
//    private LocalTime resolveAndLockSlot(
//            LocalTime requestedTime, String timing,
//            Long doctorId, Long branchServiceId,
//            LocalDate date, int avgTime, String serviceName) {
//
//        if (requestedTime != null) {
//            List<Token> existingSlots = doctorId != null
//                    ? tokenRepository.findActiveTokensWithSlotForDoctor(doctorId, date)
//                    : tokenRepository.findActiveTokensWithSlotForBranchService(branchServiceId, date);
//
//            checkSlotWindowConflict(requestedTime, existingSlots, serviceName, date, timing, avgTime);
//
//            int taken = doctorId != null
//                    ? tokenRepository.countAndLockDoctorSlot(doctorId, date, requestedTime)
//                    : tokenRepository.countAndLockBranchServiceSlot(branchServiceId, date, requestedTime);
//
//            if (taken > 0)
//                throw new TokenBookingException(
//                        "The " + formatTime(requestedTime) + " slot for " + serviceName
//                                + " on " + date + " is already booked. Please select a different time slot.");
//
//            return requestedTime;
//        }
//
//        // Auto-assign: scan forward from openTime and return first free slot
//        LocalTime openTime  = parseOpenTime(timing);
//        LocalTime closeTime = parseCloseTime(timing);
//        if (openTime == null) return null;
//        LocalTime limit = closeTime != null ? closeTime : openTime.plusHours(12);
//
//        List<Token> existingSlots2 = doctorId != null
//                ? tokenRepository.findActiveTokensWithSlotForDoctor(doctorId, date)
//                : tokenRepository.findActiveTokensWithSlotForBranchService(branchServiceId, date);
//
//        LocalTime cursor = openTime;
//        while (!cursor.isAfter(limit)) {
//            final LocalTime candidate = cursor;
//            boolean conflicts = existingSlots2.stream().anyMatch(t -> {
//                if (t.getScheduledTime() == null) return false;
//                int dur = t.getSlotDurationMinutes() != null ? t.getSlotDurationMinutes() : avgTime;
//                LocalTime slotEnd = t.getScheduledTime().plusMinutes(dur);
//                return !candidate.isBefore(t.getScheduledTime()) && candidate.isBefore(slotEnd);
//            });
//            if (!conflicts) return candidate;
//            cursor = cursor.plusMinutes(avgTime);
//        }
//
//        return existingSlots2.stream()
//                .filter(t -> t.getScheduledTime() != null)
//                .map(t -> t.getScheduledTime().plusMinutes(
//                        t.getSlotDurationMinutes() != null ? t.getSlotDurationMinutes() : avgTime))
//                .max(LocalTime::compareTo)
//                .orElse(openTime);
//    }
//
//    // =========================================================================
//    // CANCEL
//    // =========================================================================
//
//    @Transactional
//    public TokenResponse cancelToken(Long tokenId, Long userId) {
//
//        Token token = tokenRepository.findByIdWithDetails(tokenId)
//                .orElseThrow(() -> new ResourceNotFoundException("Token not found: " + tokenId));
//
//        if (!token.getUser().getId().equals(userId))
//            throw new TokenBookingException("Not authorised to cancel this token.");
//
//        if (token.getStatus() != TokenStatus.BOOKED)
//            throw new TokenBookingException("Cannot cancel a token with status: " + token.getStatus());
//
//        token.setStatus(TokenStatus.CANCELLED);
//        tokenRepository.save(token);
//        tokenRepository.clearScheduledTime(tokenId);
//        log.info("Token {} cancelled, slot freed", token.getDisplayToken());
//
//        notificationService.notifyTokenCancelled(token);
//
//        List<Token> shifted = recalculateQueueAfterCancellation(token);
//        if (!shifted.isEmpty())
//            notificationService.notifyQueueShiftedAfterCancellation(shifted, resolveAvgTime(token));
//
//        return TokenResponse.builder()
//                .tokenId(token.getId())
//                .displayToken(token.getDisplayToken())
//                .status(TokenStatus.CANCELLED)
//                .bookingDate(token.getBookingDate())
//                .message("Token " + token.getDisplayToken() + " cancelled. "
//                        + "The slot is now available for others. "
//                        + "You can now book at any time.")
//                .build();
//    }
//
//    private List<Token> recalculateQueueAfterCancellation(Token cancelledToken) {
//        List<Token> tokensToUpdate;
//        if (cancelledToken.getQueueType() == QueueType.DOCTOR) {
//            Doctor doctor = cancelledToken.getDoctor();
//            if (doctor == null) return List.of();
//            int avg = doctor.getAvgConsultationTime() > 0 ? doctor.getAvgConsultationTime() : 10;
//            tokensToUpdate = tokenRepository.findBookedTokensAfterForDoctor(
//                    doctor.getId(), cancelledToken.getBookingDate(), cancelledToken.getTokenNumber());
//            for (Token t : tokensToUpdate) {
//                t.setEstimatedWaitTimeMinutes(Math.max(0, nullSafe(t.getEstimatedWaitTimeMinutes()) - avg));
//                if (t.getScheduledTime() != null) t.setScheduledTime(t.getScheduledTime().minusMinutes(avg));
//            }
//        } else {
//            BranchService bs = cancelledToken.getBranchService();
//            if (bs == null) return List.of();
//            int avg = bs.getAvgServiceTimeMinutes() != null && bs.getAvgServiceTimeMinutes() > 0
//                    ? bs.getAvgServiceTimeMinutes() : 10;
//            tokensToUpdate = tokenRepository.findBookedTokensAfterForBranchService(
//                    bs.getId(), cancelledToken.getBookingDate(), cancelledToken.getTokenNumber());
//            for (Token t : tokensToUpdate) {
//                t.setEstimatedWaitTimeMinutes(Math.max(0, nullSafe(t.getEstimatedWaitTimeMinutes()) - avg));
//                if (t.getScheduledTime() != null) t.setScheduledTime(t.getScheduledTime().minusMinutes(avg));
//            }
//        }
//        if (!tokensToUpdate.isEmpty()) {
//            tokenRepository.saveAll(tokensToUpdate);
//            log.info("Shifted wait times for {} tokens after cancellation", tokensToUpdate.size());
//        }
//        return tokensToUpdate;
//    }
//
//    // =========================================================================
//    // STAFF — CALL NEXT
//    // =========================================================================
//
//    @Transactional
//    public TokenResponse callNextDoctorToken(Long doctorId, LocalDate date) {
//        tokenRepository.findCurrentlyServingForDoctor(doctorId, date).ifPresent(t -> {
//            completeToken(t); notificationService.notifyTokenCompleted(t);
//        });
//        Token next = tokenRepository.findNextTokenForDoctor(doctorId, date)
//                .orElseThrow(() -> new TokenBookingException("No more tokens in queue for " + date));
//        next.setStatus(TokenStatus.IN_PROGRESS);
//        next.setServingStartedAt(LocalDateTime.now());
//        Token saved = tokenRepository.save(next);
//        Token full  = tokenRepository.findByIdWithDetails(saved.getId()).orElse(saved);
//        notificationService.notifyYourTurn(full);
//        tokenRepository.findNextTokenForDoctor(doctorId, date).ifPresent(notificationService::notifyTurnNear);
//        return buildDoctorResponse(full, 0);
//    }
//
//    @Transactional
//    public TokenResponse callNextBranchServiceToken(Long branchServiceId, LocalDate date) {
//        tokenRepository.findCurrentlyServingForBranchService(branchServiceId, date).ifPresent(t -> {
//            completeToken(t); notificationService.notifyTokenCompleted(t);
//        });
//        Token next = tokenRepository.findNextTokenForBranchService(branchServiceId, date)
//                .orElseThrow(() -> new TokenBookingException("No more tokens in queue for " + date));
//        next.setStatus(TokenStatus.IN_PROGRESS);
//        next.setServingStartedAt(LocalDateTime.now());
//        Token saved = tokenRepository.save(next);
//        Token full  = tokenRepository.findByIdWithDetails(saved.getId()).orElse(saved);
//        notificationService.notifyYourTurn(full);
//        tokenRepository.findNextTokenForBranchService(branchServiceId, date).ifPresent(notificationService::notifyTurnNear);
//        return buildBranchServiceResponse(full, 0);
//    }
//
//    private void completeToken(Token t) {
//        t.setStatus(TokenStatus.COMPLETED);
//        t.setServingCompletedAt(LocalDateTime.now());
//        if (t.getServingStartedAt() != null)
//            t.setActualWaitTimeMinutes((int) Duration.between(t.getServingStartedAt(), LocalDateTime.now()).toMinutes());
//        tokenRepository.save(t);
//    }
//
//    // =========================================================================
//    // QUEUE STATUS
//    // =========================================================================
//
//    @Transactional(readOnly = true)
//    public QueueStatusResponse getDoctorQueueStatus(Long doctorId, LocalDate date) {
//        List<Token> q = tokenRepository.findDoctorQueueForDate(doctorId, date);
//        return QueueStatusResponse.builder()
//                .totalTokens((long) q.size())
//                .waitingCount(q.stream().filter(t -> t.getStatus() == TokenStatus.BOOKED || t.getStatus() == TokenStatus.CALLED).count())
//                .completedCount(q.stream().filter(t -> t.getStatus() == TokenStatus.COMPLETED).count())
//                .currentlyServingToken(tokenRepository.findCurrentlyServingForDoctor(doctorId, date).map(Token::getDisplayToken).orElse("None"))
//                .build();
//    }
//
//    @Transactional(readOnly = true)
//    public QueueStatusResponse getBranchServiceQueueStatus(Long branchServiceId, LocalDate date) {
//        List<Token> q = tokenRepository.findBranchServiceQueueForDate(branchServiceId, date);
//        return QueueStatusResponse.builder()
//                .totalTokens((long) q.size())
//                .waitingCount(q.stream().filter(t -> t.getStatus() == TokenStatus.BOOKED || t.getStatus() == TokenStatus.CALLED).count())
//                .completedCount(q.stream().filter(t -> t.getStatus() == TokenStatus.COMPLETED).count())
//                .currentlyServingToken(tokenRepository.findCurrentlyServingForBranchService(branchServiceId, date).map(Token::getDisplayToken).orElse("None"))
//                .build();
//    }
//
//    // =========================================================================
//    // USER HISTORY — live estimated wait time
//    // =========================================================================
//
//    @Transactional(readOnly = true)
//    public List<TokenResponse> getUserTokenHistory(Long userId) {
//        return tokenRepository.findAllByUserId(userId).stream().map(this::buildGenericResponse).toList();
//    }
//
//    @Transactional(readOnly = true)
//    public List<TokenResponse> getUserActiveTokens(Long userId) {
//        return tokenRepository.findActiveTokensByUserId(userId, LocalDate.now())
//                .stream().map(token -> {
//                    int liveAhead, avgTime;
//                    if (token.getQueueType() == QueueType.DOCTOR && token.getDoctor() != null) {
//                        liveAhead = tokenRepository.countActiveTokensAheadForDoctor(
//                                token.getDoctor().getId(), token.getBookingDate(), token.getTokenNumber());
//                        avgTime = token.getDoctor().getAvgConsultationTime() > 0
//                                ? token.getDoctor().getAvgConsultationTime() : 10;
//                    } else if (token.getBranchService() != null) {
//                        liveAhead = tokenRepository.countActiveTokensAheadForBranchService(
//                                token.getBranchService().getId(), token.getBookingDate(), token.getTokenNumber());
//                        avgTime = token.getBranchService().getAvgServiceTimeMinutes() != null
//                                && token.getBranchService().getAvgServiceTimeMinutes() > 0
//                                ? token.getBranchService().getAvgServiceTimeMinutes() : 10;
//                    } else { liveAhead = 0; avgTime = 10; }
//                    token.setEstimatedWaitTimeMinutes(liveAhead * avgTime);
//                    return token.getQueueType() == QueueType.DOCTOR
//                            ? buildDoctorResponse(token, liveAhead)
//                            : buildBranchServiceResponse(token, liveAhead);
//                }).toList();
//    }
//
//    // =========================================================================
//    // VALIDATION
//    // =========================================================================
//
//    private void validateBookingDate(LocalDate date) {
//        LocalDate today = LocalDate.now();
//        if (date.isBefore(today))
//            throw new TokenBookingException("Cannot book a token for a past date.");
//        if (date.isAfter(today.plusDays(7)))
//            throw new TokenBookingException("Advance booking is limited to 7 days.");
//    }
//
//    private void validateBookingTime(LocalDate date, LocalTime time, String name) {
//        if (time == null || !date.isEqual(LocalDate.now())) return;
//        if (time.isBefore(LocalTime.now()))
//            throw new TokenBookingException(
//                    "Cannot book " + name + " at " + formatTime(time)
//                            + " — that time has already passed. Please select a future time slot.");
//    }
//
//    private void validateServiceTiming(String timing, String name) {
//        if (timing == null || timing.isBlank()) return;
//        String lower = timing.toLowerCase().replace(" ", "");
//        if (lower.contains("24") || lower.contains("always") || lower.contains("allday")) return;
//        try {
//            String n = timing.replace(" ", "").replace("–", "-").replace("—", "-")
//                    .toUpperCase().replaceAll("TO", "-");
//            String[] parts = n.split("-");
//            if (parts.length != 2) return;
//            LocalTime open  = parseTime(parts[0]);
//            LocalTime close = parseTime(parts[1]);
//            LocalTime now   = LocalTime.now();
//            if (now.isBefore(open))
//                throw new TokenBookingException(name + " is not open yet. Hours: " + parts[0] + " – " + parts[1]);
//            if (now.isAfter(close))
//                throw new TokenBookingException(name + " is closed. Hours: " + parts[0] + " – " + parts[1]);
//        } catch (TokenBookingException e) {
//            throw e;
//        } catch (Exception e) {
//            log.warn("Could not parse timing '{}': {}", timing, e.getMessage());
//        }
//    }
//
//    // =========================================================================
//    // HELPERS
//    // =========================================================================
//
//    private LocalTime parseOpenTime(String timing) {
//        try { String[] p = normalizeTiming(timing); return p != null ? parseTime(p[0]) : null; }
//        catch (Exception e) { return null; }
//    }
//
//    private LocalTime parseCloseTime(String timing) {
//        try { String[] p = normalizeTiming(timing); return p != null ? parseTime(p[1]) : null; }
//        catch (Exception e) { return null; }
//    }
//
//    private String[] normalizeTiming(String timing) {
//        if (timing == null || timing.isBlank()) return null;
//        String lower = timing.toLowerCase().replace(" ", "");
//        if (lower.contains("24") || lower.contains("always") || lower.contains("allday")) return null;
//        String n = timing.replace(" ", "").replace("–", "-").replace("—", "-")
//                .toUpperCase().replaceAll("TO", "-");
//        String[] parts = n.split("-");
//        return parts.length == 2 ? parts : null;
//    }
//
//    private LocalTime parseTime(String s) {
//        s = s.trim().toUpperCase();
//        if (s.contains(":")) {
//            if (s.endsWith("AM") || s.endsWith("PM"))
//                return LocalTime.parse(s, DateTimeFormatter.ofPattern("h:mma").withLocale(java.util.Locale.ENGLISH));
//            return LocalTime.parse(s, DateTimeFormatter.ofPattern("HH:mm"));
//        }
//        if (s.endsWith("AM") || s.endsWith("PM")) {
//            String hs = s.replace("AM", "").replace("PM", "");
//            int h = Integer.parseInt(hs);
//            if (s.endsWith("PM") && h != 12) h += 12;
//            if (s.endsWith("AM") && h == 12) h = 0;
//            return LocalTime.of(h, 0);
//        }
//        return LocalTime.of(Integer.parseInt(s), 0);
//    }
//
//    private String formatTime(LocalTime t) {
//        if (t == null) return "N/A";
//        return t.format(DateTimeFormatter.ofPattern("hh:mm a"));
//    }
//
//    private String buildDisplayToken(String prefix, int n) {
//        return prefix + String.format("%03d", n);
//    }
//
//    private String getPrefixFromCategory(Branch branch) {
//        try {
//            return switch (branch.getCategory().getCode().toUpperCase()) {
//                case "BANK" -> "BS"; case "GOVT" -> "GS";
//                case "HOTL" -> "HS"; case "HOSP" -> "MS";
//                default -> "T";
//            };
//        } catch (Exception e) { return "T"; }
//    }
//
//    private int resolveAvgTime(Token token) {
//        if (token.getQueueType() == QueueType.DOCTOR && token.getDoctor() != null)
//            return token.getDoctor().getAvgConsultationTime() > 0 ? token.getDoctor().getAvgConsultationTime() : 10;
//        if (token.getBranchService() != null && token.getBranchService().getAvgServiceTimeMinutes() != null
//                && token.getBranchService().getAvgServiceTimeMinutes() > 0)
//            return token.getBranchService().getAvgServiceTimeMinutes();
//        return 10;
//    }
//
//    private int nullSafe(Integer v) { return v != null ? v : 0; }
//
//    // =========================================================================
//    // RESPONSE BUILDERS
//    // =========================================================================
//
//    private TokenResponse buildDoctorResponse(Token t, int queuePos) {
//        Doctor d = t.getDoctor(); Branch b = t.getBranch(); User u = t.getUser();
//        LocalTime slotEnd = t.getScheduledTime() != null
//                ? t.getScheduledTime().plusMinutes(nullSafe(t.getSlotDurationMinutes())) : null;
//        return TokenResponse.builder()
//                .tokenId(t.getId()).displayToken(t.getDisplayToken()).tokenNumber(t.getTokenNumber())
//                .queuePosition(queuePos).estimatedWaitTimeMinutes(t.getEstimatedWaitTimeMinutes())
//                .scheduledTime(t.getScheduledTime()).slotEndTime(slotEnd)
//                .slotDurationMinutes(t.getSlotDurationMinutes())
//                .queueType(t.getQueueType()).status(t.getStatus()).bookingDate(t.getBookingDate())
//                .doctorId(d.getId()).doctorName(d.getName())
//                .doctorSpecialization(d.getSpecialization()).doctorTiming(d.getTiming())
//                .branchId(b.getId()).branchName(b.getName()).branchLocation(b.getLocation())
//                .userId(u.getId()).userName(u.getUsername()).bookedAt(t.getCreatedAt())
//                .message("Token " + t.getDisplayToken() + " booked! Est. wait: "
//                        + t.getEstimatedWaitTimeMinutes() + " min."
//                        + (t.getScheduledTime() != null
//                        ? " Your slot: " + formatTime(t.getScheduledTime()) + " – " + formatTime(slotEnd) : ""))
//                .build();
//    }
//
//    private TokenResponse buildBranchServiceResponse(Token t, int queuePos) {
//        BranchService bs = t.getBranchService(); Branch b = t.getBranch(); User u = t.getUser();
//        LocalTime slotEnd = t.getScheduledTime() != null
//                ? t.getScheduledTime().plusMinutes(nullSafe(t.getSlotDurationMinutes())) : null;
//        return TokenResponse.builder()
//                .tokenId(t.getId()).displayToken(t.getDisplayToken()).tokenNumber(t.getTokenNumber())
//                .queuePosition(queuePos).estimatedWaitTimeMinutes(t.getEstimatedWaitTimeMinutes())
//                .scheduledTime(t.getScheduledTime()).slotEndTime(slotEnd)
//                .slotDurationMinutes(t.getSlotDurationMinutes())
//                .queueType(t.getQueueType()).status(t.getStatus()).bookingDate(t.getBookingDate())
//                .branchServiceId(bs.getId()).branchServiceName(bs.getName())
//                .branchServiceCounter(bs.getCounter()).branchServiceTiming(bs.getTiming())
//                .branchId(b.getId()).branchName(b.getName()).branchLocation(b.getLocation())
//                .userId(u.getId()).userName(u.getUsername()).bookedAt(t.getCreatedAt())
//                .message("Token " + t.getDisplayToken() + " booked! Est. wait: "
//                        + t.getEstimatedWaitTimeMinutes() + " min."
//                        + (t.getScheduledTime() != null
//                        ? " Your slot: " + formatTime(t.getScheduledTime()) + " – " + formatTime(slotEnd) : ""))
//                .build();
//    }
//
//    private TokenResponse buildGenericResponse(Token t) {
//        int ahead = 0;
//        if (t.getQueueType() == QueueType.DOCTOR && t.getDoctor() != null)
//            ahead = tokenRepository.countActiveTokensAheadForDoctor(t.getDoctor().getId(), t.getBookingDate(), t.getTokenNumber());
//        else if (t.getBranchService() != null)
//            ahead = tokenRepository.countActiveTokensAheadForBranchService(t.getBranchService().getId(), t.getBookingDate(), t.getTokenNumber());
//        return t.getQueueType() == QueueType.DOCTOR ? buildDoctorResponse(t, ahead) : buildBranchServiceResponse(t, ahead);
//    }
//}
















package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.QueueStatusResponse;
import com.example.Queue_Master.dto.TokenRequest;
import com.example.Queue_Master.dto.TokenResponse;
import com.example.Queue_Master.entity.Branch;
import com.example.Queue_Master.entity.BranchService;
import com.example.Queue_Master.entity.Doctor;
import com.example.Queue_Master.entity.Token;
import com.example.Queue_Master.entity.Token.QueueType;
import com.example.Queue_Master.entity.Token.ShiftType;
import com.example.Queue_Master.entity.Token.TokenStatus;
import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.exception.ResourceNotFoundException;
import com.example.Queue_Master.exception.TokenBookingException;
import com.example.Queue_Master.repository.BranchServiceRepository;
import com.example.Queue_Master.repository.DoctorRepository;
import com.example.Queue_Master.repository.TokenRepository;
import com.example.Queue_Master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenService {

    // =========================================================================
    // SHIFT CONFIGURATION
    // =========================================================================

    // Morning: 9:00 AM – 1:00 PM, max 20 tokens
    private static final LocalTime MORNING_START   = LocalTime.of(9, 0);
    private static final LocalTime MORNING_END     = LocalTime.of(13, 0);
    private static final int       MORNING_MAX     = 20;

    // Afternoon: 2:00 PM – 5:00 PM, max 15 tokens
    private static final LocalTime AFTERNOON_START = LocalTime.of(14, 0);
    private static final LocalTime AFTERNOON_END   = LocalTime.of(17, 0);
    private static final int       AFTERNOON_MAX   = 15;

    private final TokenRepository         tokenRepository;
    private final UserRepository          userRepository;
    private final DoctorRepository        doctorRepository;
    private final BranchServiceRepository branchServiceRepository;
    private final UserNotificationService notificationService;

    // =========================================================================
    // SHIFT HELPERS
    // =========================================================================

    private LocalTime shiftStart(ShiftType shift) {
        return shift == ShiftType.MORNING ? MORNING_START : AFTERNOON_START;
    }

    private LocalTime shiftEnd(ShiftType shift) {
        return shift == ShiftType.MORNING ? MORNING_END : AFTERNOON_END;
    }

    private int shiftMaxTokens(ShiftType shift) {
        return shift == ShiftType.MORNING ? MORNING_MAX : AFTERNOON_MAX;
    }

    private String shiftLabel(ShiftType shift) {
        return shift == ShiftType.MORNING
                ? "Morning (9:00 AM – 1:00 PM)"
                : "Afternoon (2:00 PM – 5:00 PM)";
    }

    /**
     * Validates the shift hasn't ended yet (only for same-day bookings).
     */
    private void validateShiftIsOpen(LocalDate date, ShiftType shift) {
        if (!date.isEqual(LocalDate.now())) return;
        LocalTime now = LocalTime.now();
        LocalTime end = shiftEnd(shift);
        if (now.isAfter(end))
            throw new TokenBookingException(
                    shiftLabel(shift) + " shift has already ended for today.");
    }

    /**
     * Calculates an estimated scheduled time within the shift window
     * based on the user's queue position. This is informational only —
     * actual ordering is by token number.
     */
    private LocalTime estimatedTimeForPosition(ShiftType shift, int position, int avgTime) {
        return shiftStart(shift).plusMinutes((long) position * avgTime);
    }

    // =========================================================================
    // BOOK TOKEN — entry point
    // =========================================================================

    @Transactional
    public TokenResponse bookToken(TokenRequest request) {
        validateBookingDate(request.getBookingDate());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUserId()));
        return switch (request.getQueueType()) {
            case DOCTOR         -> bookDoctorToken(request, user);
            case BRANCH_SERVICE -> bookBranchServiceToken(request, user);
        };
    }

    // =========================================================================
    // BOOK — DOCTOR
    // =========================================================================

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public TokenResponse bookDoctorToken(TokenRequest request, User user) {

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + request.getDoctorId()));

        if (!"Available".equalsIgnoreCase(doctor.getStatus()))
            throw new TokenBookingException("Dr. " + doctor.getName() + " is not available.");

        ShiftType shift = request.getShift();
        validateShiftIsOpen(request.getBookingDate(), shift);

        // One token per user per doctor per shift per date
        boolean alreadyBooked = tokenRepository.existsActiveTokenForUserDoctorShift(
                user.getId(), doctor.getId(), request.getBookingDate(), shift);
        if (alreadyBooked)
            throw new TokenBookingException(
                    "You already have an active token for Dr. " + doctor.getName()
                            + " in the " + shiftLabel(shift) + " shift on "
                            + request.getBookingDate() + ".");

        // Max-token cap
        int shiftMax   = shiftMaxTokens(shift);
        int shiftCount = tokenRepository.countTokensForDoctorShift(
                doctor.getId(), request.getBookingDate(), shift);
        if (shiftCount >= shiftMax)
            throw new TokenBookingException(
                    "The " + shiftLabel(shift) + " shift for Dr. " + doctor.getName()
                            + " on " + request.getBookingDate() + " is fully booked ("
                            + shiftMax + "/" + shiftMax + " tokens). "
                            + "Please choose the other shift.");

        tokenRepository.lockDoctorQueueForDate(doctor.getId(), request.getBookingDate());

        int avgTime     = doctor.getAvgConsultationTime() > 0 ? doctor.getAvgConsultationTime() : 10;
        int nextNumber  = tokenRepository.findMaxTokenNumberByDoctorDateShift(
                doctor.getId(), request.getBookingDate(), shift).map(m -> m + 1).orElse(1);
        int tokensAhead   = tokenRepository.countActiveTokensAheadForDoctorShift(
                doctor.getId(), request.getBookingDate(), shift, nextNumber);
        int estimatedWait = tokensAhead * avgTime;

        LocalTime scheduledTime = estimatedTimeForPosition(shift, tokensAhead, avgTime);
        LocalTime slotEnd       = scheduledTime.plusMinutes(avgTime);

        Token token = Token.builder()
                .tokenNumber(nextNumber)
                .displayToken(buildDisplayToken("D", nextNumber))
                .bookingDate(request.getBookingDate())
                .status(TokenStatus.BOOKED)
                .queueType(QueueType.DOCTOR)
                .shiftType(shift)
                .user(user).doctor(doctor).branch(doctor.getBranch())
                .scheduledTime(scheduledTime)
                .slotEndTime(slotEnd)
                .slotDurationMinutes(avgTime)
                .estimatedWaitTimeMinutes(estimatedWait)
                .build();

        Token saved = tokenRepository.saveAndFlush(token);

        log.info("Doctor token booked: {}, shift={}, position={}, estWait={}min",
                saved.getDisplayToken(), shift, tokensAhead, estimatedWait);
        notificationService.notifyTokenBooked(saved);
        return buildDoctorResponse(saved, tokensAhead);
    }

    // =========================================================================
    // BOOK — BRANCH SERVICE
    // =========================================================================

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public TokenResponse bookBranchServiceToken(TokenRequest request, User user) {

        BranchService bs = branchServiceRepository.findById(request.getBranchServiceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch service not found: " + request.getBranchServiceId()));

        if (!"Available".equalsIgnoreCase(bs.getStatus()))
            throw new TokenBookingException("Service '" + bs.getName() + "' is unavailable.");

        ShiftType shift = request.getShift();
        validateShiftIsOpen(request.getBookingDate(), shift);

        // One token per user per service per shift per date
        boolean alreadyBooked = tokenRepository.existsActiveTokenForUserBranchServiceShift(
                user.getId(), bs.getId(), request.getBookingDate(), shift);
        if (alreadyBooked)
            throw new TokenBookingException(
                    "You already have an active token for '" + bs.getName()
                            + "' in the " + shiftLabel(shift) + " shift on "
                            + request.getBookingDate() + ".");

        // Max-token cap
        int shiftMax   = shiftMaxTokens(shift);
        int shiftCount = tokenRepository.countTokensForBranchServiceShift(
                bs.getId(), request.getBookingDate(), shift);
        if (shiftCount >= shiftMax)
            throw new TokenBookingException(
                    "The " + shiftLabel(shift) + " shift for '" + bs.getName()
                            + "' on " + request.getBookingDate() + " is fully booked ("
                            + shiftMax + "/" + shiftMax + " tokens). "
                            + "Please choose the other shift.");

        tokenRepository.lockBranchServiceQueueForDate(bs.getId(), request.getBookingDate());

        int avgTime    = bs.getAvgServiceTimeMinutes() != null && bs.getAvgServiceTimeMinutes() > 0
                ? bs.getAvgServiceTimeMinutes() : 10;
        String prefix  = getPrefixFromCategory(bs.getBranch());
        int nextNumber = tokenRepository.findMaxTokenNumberByBranchServiceDateShift(
                bs.getId(), request.getBookingDate(), shift).map(m -> m + 1).orElse(1);
        int tokensAhead   = tokenRepository.countActiveTokensAheadForBranchServiceShift(
                bs.getId(), request.getBookingDate(), shift, nextNumber);
        int estimatedWait = tokensAhead * avgTime;

        LocalTime scheduledTime = estimatedTimeForPosition(shift, tokensAhead, avgTime);
        LocalTime slotEnd       = scheduledTime.plusMinutes(avgTime);

        Token token = Token.builder()
                .tokenNumber(nextNumber)
                .displayToken(buildDisplayToken(prefix, nextNumber))
                .bookingDate(request.getBookingDate())
                .status(TokenStatus.BOOKED)
                .queueType(QueueType.BRANCH_SERVICE)
                .shiftType(shift)
                .user(user).branchService(bs).branch(bs.getBranch())
                .scheduledTime(scheduledTime)
                .slotEndTime(slotEnd)
                .slotDurationMinutes(avgTime)
                .estimatedWaitTimeMinutes(estimatedWait)
                .build();

        Token saved = tokenRepository.saveAndFlush(token);

        log.info("Branch service token booked: {}, shift={}, position={}, estWait={}min",
                saved.getDisplayToken(), shift, tokensAhead, estimatedWait);
        notificationService.notifyTokenBooked(saved);
        return buildBranchServiceResponse(saved, tokensAhead);
    }

    // =========================================================================
    // CANCEL — update queue positions for every token behind the cancelled one
    // =========================================================================

    @Transactional
    public TokenResponse cancelToken(Long tokenId, Long userId) {

        Token token = tokenRepository.findByIdWithDetails(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found: " + tokenId));

        if (!token.getUser().getId().equals(userId))
            throw new TokenBookingException("Not authorised to cancel this token.");

        if (token.getStatus() != TokenStatus.BOOKED)
            throw new TokenBookingException(
                    "Cannot cancel a token with status: " + token.getStatus());

        token.setStatus(TokenStatus.CANCELLED);
        tokenRepository.save(token);
        tokenRepository.clearScheduledTime(tokenId);
        log.info("Token {} cancelled, slot freed", token.getDisplayToken());

        notificationService.notifyTokenCancelled(token);

        // Shift estimated wait time and scheduled time for all tokens behind
        List<Token> shifted = recalculateQueueAfterCancellation(token);
        if (!shifted.isEmpty())
            notificationService.notifyQueueShiftedAfterCancellation(shifted, resolveAvgTime(token));

        ShiftType shift = token.getShiftType();
        return TokenResponse.builder()
                .tokenId(token.getId())
                .displayToken(token.getDisplayToken())
                .status(TokenStatus.CANCELLED)
                .bookingDate(token.getBookingDate())
                .shift(shift)
                .shiftLabel(shift != null ? shiftLabel(shift) : null)
                .message("Token " + token.getDisplayToken() + " cancelled. "
                        + "Your queue position has been freed. "
                        + shifted.size() + " user(s) behind you have been notified "
                        + "of improved wait times.")
                .build();
    }

    /**
     * After a cancellation, reduce estimated wait time and shift the scheduled
     * time forward for every BOOKED token that had a higher token number in the
     * same shift on the same day.
     */
    private List<Token> recalculateQueueAfterCancellation(Token cancelledToken) {
        List<Token> tokensToUpdate;
        ShiftType shift = cancelledToken.getShiftType();

        if (cancelledToken.getQueueType() == QueueType.DOCTOR) {
            Doctor doctor = cancelledToken.getDoctor();
            if (doctor == null) return List.of();
            int avg = doctor.getAvgConsultationTime() > 0 ? doctor.getAvgConsultationTime() : 10;

            tokensToUpdate = (shift != null)
                    ? tokenRepository.findBookedTokensAfterForDoctorShift(
                    doctor.getId(), cancelledToken.getBookingDate(),
                    shift, cancelledToken.getTokenNumber())
                    : tokenRepository.findBookedTokensAfterForDoctor(
                    doctor.getId(), cancelledToken.getBookingDate(),
                    cancelledToken.getTokenNumber());

            for (Token t : tokensToUpdate) {
                t.setEstimatedWaitTimeMinutes(
                        Math.max(0, nullSafe(t.getEstimatedWaitTimeMinutes()) - avg));
                if (t.getScheduledTime() != null)
                    t.setScheduledTime(t.getScheduledTime().minusMinutes(avg));
            }

        } else {
            BranchService bs = cancelledToken.getBranchService();
            if (bs == null) return List.of();
            int avg = bs.getAvgServiceTimeMinutes() != null && bs.getAvgServiceTimeMinutes() > 0
                    ? bs.getAvgServiceTimeMinutes() : 10;

            tokensToUpdate = (shift != null)
                    ? tokenRepository.findBookedTokensAfterForBranchServiceShift(
                    bs.getId(), cancelledToken.getBookingDate(),
                    shift, cancelledToken.getTokenNumber())
                    : tokenRepository.findBookedTokensAfterForBranchService(
                    bs.getId(), cancelledToken.getBookingDate(),
                    cancelledToken.getTokenNumber());

            for (Token t : tokensToUpdate) {
                t.setEstimatedWaitTimeMinutes(
                        Math.max(0, nullSafe(t.getEstimatedWaitTimeMinutes()) - avg));
                if (t.getScheduledTime() != null)
                    t.setScheduledTime(t.getScheduledTime().minusMinutes(avg));
            }
        }

        if (!tokensToUpdate.isEmpty()) {
            tokenRepository.saveAll(tokensToUpdate);
            log.info("Recalculated wait times for {} tokens after cancellation of {}",
                    tokensToUpdate.size(), cancelledToken.getDisplayToken());
        }
        return tokensToUpdate;
    }

    // =========================================================================
    // STAFF — CALL NEXT
    // =========================================================================

    @Transactional
    public TokenResponse callNextDoctorToken(Long doctorId, LocalDate date) {
        tokenRepository.findCurrentlyServingForDoctor(doctorId, date).ifPresent(t -> {
            completeToken(t); notificationService.notifyTokenCompleted(t);
        });
        Token next = tokenRepository.findNextTokenForDoctor(doctorId, date)
                .orElseThrow(() -> new TokenBookingException(
                        "No more tokens in queue for " + date));
        next.setStatus(TokenStatus.IN_PROGRESS);
        next.setServingStartedAt(LocalDateTime.now());
        Token saved = tokenRepository.save(next);
        Token full  = tokenRepository.findByIdWithDetails(saved.getId()).orElse(saved);
        notificationService.notifyYourTurn(full);
        tokenRepository.findNextTokenForDoctor(doctorId, date)
                .ifPresent(notificationService::notifyTurnNear);
        return buildDoctorResponse(full, 0);
    }

    @Transactional
    public TokenResponse callNextBranchServiceToken(Long branchServiceId, LocalDate date) {
        tokenRepository.findCurrentlyServingForBranchService(branchServiceId, date).ifPresent(t -> {
            completeToken(t); notificationService.notifyTokenCompleted(t);
        });
        Token next = tokenRepository.findNextTokenForBranchService(branchServiceId, date)
                .orElseThrow(() -> new TokenBookingException(
                        "No more tokens in queue for " + date));
        next.setStatus(TokenStatus.IN_PROGRESS);
        next.setServingStartedAt(LocalDateTime.now());
        Token saved = tokenRepository.save(next);
        Token full  = tokenRepository.findByIdWithDetails(saved.getId()).orElse(saved);
        notificationService.notifyYourTurn(full);
        tokenRepository.findNextTokenForBranchService(branchServiceId, date)
                .ifPresent(notificationService::notifyTurnNear);
        return buildBranchServiceResponse(full, 0);
    }

    private void completeToken(Token t) {
        t.setStatus(TokenStatus.COMPLETED);
        t.setServingCompletedAt(LocalDateTime.now());
        if (t.getServingStartedAt() != null)
            t.setActualWaitTimeMinutes(
                    (int) Duration.between(t.getServingStartedAt(), LocalDateTime.now()).toMinutes());
        tokenRepository.save(t);
    }

    // =========================================================================
    // QUEUE STATUS
    // =========================================================================

    @Transactional(readOnly = true)
    public QueueStatusResponse getDoctorQueueStatus(Long doctorId, LocalDate date) {
        List<Token> q = tokenRepository.findDoctorQueueForDate(doctorId, date);
        return QueueStatusResponse.builder()
                .totalTokens((long) q.size())
                .waitingCount(q.stream().filter(t ->
                        t.getStatus() == TokenStatus.BOOKED ||
                                t.getStatus() == TokenStatus.CALLED).count())
                .completedCount(q.stream().filter(t ->
                        t.getStatus() == TokenStatus.COMPLETED).count())
                .currentlyServingToken(tokenRepository
                        .findCurrentlyServingForDoctor(doctorId, date)
                        .map(Token::getDisplayToken).orElse("None"))
                .build();
    }

    @Transactional(readOnly = true)
    public QueueStatusResponse getBranchServiceQueueStatus(Long branchServiceId, LocalDate date) {
        List<Token> q = tokenRepository.findBranchServiceQueueForDate(branchServiceId, date);
        return QueueStatusResponse.builder()
                .totalTokens((long) q.size())
                .waitingCount(q.stream().filter(t ->
                        t.getStatus() == TokenStatus.BOOKED ||
                                t.getStatus() == TokenStatus.CALLED).count())
                .completedCount(q.stream().filter(t ->
                        t.getStatus() == TokenStatus.COMPLETED).count())
                .currentlyServingToken(tokenRepository
                        .findCurrentlyServingForBranchService(branchServiceId, date)
                        .map(Token::getDisplayToken).orElse("None"))
                .build();
    }

    // =========================================================================
    // USER HISTORY — with live estimated wait time
    // =========================================================================

    @Transactional(readOnly = true)
    public List<TokenResponse> getUserTokenHistory(Long userId) {
        return tokenRepository.findAllByUserId(userId)
                .stream().map(this::buildGenericResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TokenResponse> getUserActiveTokens(Long userId) {
        return tokenRepository.findActiveTokensByUserId(userId, LocalDate.now())
                .stream().map(token -> {
                    int liveAhead, avgTime;
                    ShiftType shift = token.getShiftType();

                    if (token.getQueueType() == QueueType.DOCTOR && token.getDoctor() != null) {
                        liveAhead = (shift != null)
                                ? tokenRepository.countActiveTokensAheadForDoctorShift(
                                token.getDoctor().getId(), token.getBookingDate(),
                                shift, token.getTokenNumber())
                                : tokenRepository.countActiveTokensAheadForDoctor(
                                token.getDoctor().getId(), token.getBookingDate(),
                                token.getTokenNumber());
                        avgTime = token.getDoctor().getAvgConsultationTime() > 0
                                ? token.getDoctor().getAvgConsultationTime() : 10;
                    } else if (token.getBranchService() != null) {
                        liveAhead = (shift != null)
                                ? tokenRepository.countActiveTokensAheadForBranchServiceShift(
                                token.getBranchService().getId(), token.getBookingDate(),
                                shift, token.getTokenNumber())
                                : tokenRepository.countActiveTokensAheadForBranchService(
                                token.getBranchService().getId(), token.getBookingDate(),
                                token.getTokenNumber());
                        avgTime = token.getBranchService().getAvgServiceTimeMinutes() != null
                                && token.getBranchService().getAvgServiceTimeMinutes() > 0
                                ? token.getBranchService().getAvgServiceTimeMinutes() : 10;
                    } else { liveAhead = 0; avgTime = 10; }

                    token.setEstimatedWaitTimeMinutes(liveAhead * avgTime);
                    if (shift != null)
                        token.setScheduledTime(estimatedTimeForPosition(shift, liveAhead, avgTime));

                    return token.getQueueType() == QueueType.DOCTOR
                            ? buildDoctorResponse(token, liveAhead)
                            : buildBranchServiceResponse(token, liveAhead);
                }).toList();
    }

    // =========================================================================
    // VALIDATION
    // =========================================================================

    private void validateBookingDate(LocalDate date) {
        LocalDate today = LocalDate.now();
        if (date.isBefore(today))
            throw new TokenBookingException("Cannot book a token for a past date.");
        if (date.isAfter(today.plusDays(7)))
            throw new TokenBookingException("Advance booking is limited to 7 days.");
    }

    // =========================================================================
    // HELPERS
    // =========================================================================

    private String formatTime(LocalTime t) {
        if (t == null) return "N/A";
        return t.format(DateTimeFormatter.ofPattern("hh:mm a"));
    }

    private String buildDisplayToken(String prefix, int n) {
        return prefix + String.format("%03d", n);
    }

    private String getPrefixFromCategory(Branch branch) {
        try {
            return switch (branch.getCategory().getCode().toUpperCase()) {
                case "BANK" -> "BS"; case "GOVT" -> "GS";
                case "HOTL" -> "HS"; case "HOSP" -> "MS";
                default -> "T";
            };
        } catch (Exception e) { return "T"; }
    }

    private int resolveAvgTime(Token token) {
        if (token.getQueueType() == QueueType.DOCTOR && token.getDoctor() != null)
            return token.getDoctor().getAvgConsultationTime() > 0
                    ? token.getDoctor().getAvgConsultationTime() : 10;
        if (token.getBranchService() != null
                && token.getBranchService().getAvgServiceTimeMinutes() != null
                && token.getBranchService().getAvgServiceTimeMinutes() > 0)
            return token.getBranchService().getAvgServiceTimeMinutes();
        return 10;
    }

    private int nullSafe(Integer v) { return v != null ? v : 0; }

    // =========================================================================
    // RESPONSE BUILDERS
    // =========================================================================

    private TokenResponse buildDoctorResponse(Token t, int queuePos) {
        Doctor d = t.getDoctor(); Branch b = t.getBranch(); User u = t.getUser();
        LocalTime slotEnd = t.getScheduledTime() != null
                ? t.getScheduledTime().plusMinutes(nullSafe(t.getSlotDurationMinutes())) : null;
        ShiftType shift = t.getShiftType();
        String sl = shift != null ? shiftLabel(shift) : null;
        return TokenResponse.builder()
                .tokenId(t.getId()).displayToken(t.getDisplayToken()).tokenNumber(t.getTokenNumber())
                .queuePosition(queuePos).estimatedWaitTimeMinutes(t.getEstimatedWaitTimeMinutes())
                .scheduledTime(t.getScheduledTime()).slotEndTime(slotEnd)
                .slotDurationMinutes(t.getSlotDurationMinutes())
                .shift(shift).shiftLabel(sl)
                .queueType(t.getQueueType()).status(t.getStatus()).bookingDate(t.getBookingDate())
                .doctorId(d.getId()).doctorName(d.getName())
                .doctorSpecialization(d.getSpecialization()).doctorTiming(d.getTiming())
                .branchId(b.getId()).branchName(b.getName()).branchLocation(b.getLocation())
                .userId(u.getId()).userName(u.getUsername()).bookedAt(t.getCreatedAt())
                .message("Token " + t.getDisplayToken() + " booked for " + sl + "! "
                        + "Est. wait: " + t.getEstimatedWaitTimeMinutes() + " min."
                        + (t.getScheduledTime() != null
                        ? " Your est. slot: " + formatTime(t.getScheduledTime())
                          + " – " + formatTime(slotEnd) : ""))
                .build();
    }

    private TokenResponse buildBranchServiceResponse(Token t, int queuePos) {
        BranchService bs = t.getBranchService(); Branch b = t.getBranch(); User u = t.getUser();
        LocalTime slotEnd = t.getScheduledTime() != null
                ? t.getScheduledTime().plusMinutes(nullSafe(t.getSlotDurationMinutes())) : null;
        ShiftType shift = t.getShiftType();
        String sl = shift != null ? shiftLabel(shift) : null;
        return TokenResponse.builder()
                .tokenId(t.getId()).displayToken(t.getDisplayToken()).tokenNumber(t.getTokenNumber())
                .queuePosition(queuePos).estimatedWaitTimeMinutes(t.getEstimatedWaitTimeMinutes())
                .scheduledTime(t.getScheduledTime()).slotEndTime(slotEnd)
                .slotDurationMinutes(t.getSlotDurationMinutes())
                .shift(shift).shiftLabel(sl)
                .queueType(t.getQueueType()).status(t.getStatus()).bookingDate(t.getBookingDate())
                .branchServiceId(bs.getId()).branchServiceName(bs.getName())
                .branchServiceCounter(bs.getCounter()).branchServiceTiming(bs.getTiming())
                .branchId(b.getId()).branchName(b.getName()).branchLocation(b.getLocation())
                .userId(u.getId()).userName(u.getUsername()).bookedAt(t.getCreatedAt())
                .message("Token " + t.getDisplayToken() + " booked for " + sl + "! "
                        + "Est. wait: " + t.getEstimatedWaitTimeMinutes() + " min."
                        + (t.getScheduledTime() != null
                        ? " Your est. slot: " + formatTime(t.getScheduledTime())
                          + " – " + formatTime(slotEnd) : ""))
                .build();
    }

    private TokenResponse buildGenericResponse(Token t) {
        int ahead = 0;
        ShiftType shift = t.getShiftType();
        if (t.getQueueType() == QueueType.DOCTOR && t.getDoctor() != null)
            ahead = (shift != null)
                    ? tokenRepository.countActiveTokensAheadForDoctorShift(
                    t.getDoctor().getId(), t.getBookingDate(), shift, t.getTokenNumber())
                    : tokenRepository.countActiveTokensAheadForDoctor(
                    t.getDoctor().getId(), t.getBookingDate(), t.getTokenNumber());
        else if (t.getBranchService() != null)
            ahead = (shift != null)
                    ? tokenRepository.countActiveTokensAheadForBranchServiceShift(
                    t.getBranchService().getId(), t.getBookingDate(), shift, t.getTokenNumber())
                    : tokenRepository.countActiveTokensAheadForBranchService(
                    t.getBranchService().getId(), t.getBookingDate(), t.getTokenNumber());
        return t.getQueueType() == QueueType.DOCTOR
                ? buildDoctorResponse(t, ahead) : buildBranchServiceResponse(t, ahead);
    }
}
