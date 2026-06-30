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
//import com.example.Queue_Master.entity.Token.ShiftType;
//import com.example.Queue_Master.entity.Token.TokenStatus;
//import com.example.Queue_Master.entity.User;
//import com.example.Queue_Master.exception.BadRequestException;
//import com.example.Queue_Master.exception.ResourceNotFoundException;
//import com.example.Queue_Master.exception.TokenBookingException;
//import com.example.Queue_Master.repository.BranchServiceRepository;
//import com.example.Queue_Master.repository.DoctorRepository;
//import com.example.Queue_Master.repository.TokenRepository;
//import com.example.Queue_Master.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Isolation;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.Duration;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.LocalTime;
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class TokenService {
//
//    // =========================================================================
//    // SHIFT CONFIGURATION
//    // =========================================================================
//
//    // Morning: 9:00 AM – 1:00 PM, max 20 tokens
//    private static final LocalTime MORNING_START   = LocalTime.of(9, 0);
//    private static final LocalTime MORNING_END     = LocalTime.of(13, 0);
//    private static final int       MORNING_MAX     = 20;
//
//    // Afternoon: 2:00 PM – 5:00 PM, max 15 tokens
//    private static final LocalTime AFTERNOON_START = LocalTime.of(14, 0);
//    private static final LocalTime AFTERNOON_END   = LocalTime.of(17, 0);
//    private static final int       AFTERNOON_MAX   = 15;
//
//    private final TokenRepository         tokenRepository;
//    private final UserRepository          userRepository;
//    private final DoctorRepository        doctorRepository;
//    private final BranchServiceRepository branchServiceRepository;
//    private final UserNotificationService notificationService;
//
//    // =========================================================================
//    // SHIFT HELPERS
//    // =========================================================================
//
//    private LocalTime shiftStart(ShiftType shift) {
//        return shift == ShiftType.MORNING ? MORNING_START : AFTERNOON_START;
//    }
//
//    private LocalTime shiftEnd(ShiftType shift) {
//        return shift == ShiftType.MORNING ? MORNING_END : AFTERNOON_END;
//    }
//
//    private int shiftMaxTokens(ShiftType shift) {
//        return shift == ShiftType.MORNING ? MORNING_MAX : AFTERNOON_MAX;
//    }
//
//    private String shiftLabel(ShiftType shift) {
//        return shift == ShiftType.MORNING
//                ? "Morning (9:00 AM – 1:00 PM)"
//                : "Afternoon (2:00 PM – 5:00 PM)";
//    }
//
//    /**
//     * Validates the shift hasn't ended yet (only for same-day bookings).
//     */
//    private void validateShiftIsOpen(LocalDate date, ShiftType shift) {
//        if (!date.isEqual(LocalDate.now())) return;
//        LocalTime now = LocalTime.now();
//        LocalTime end = shiftEnd(shift);
//        if (now.isAfter(end))
//            throw new TokenBookingException(
//                    shiftLabel(shift) + " shift has already ended for today.");
//    }
//
//    /**
//     * Convenience overload used by getUserActiveTokens (live refresh, always today).
//     */
//    private LocalTime estimatedTimeForPosition(ShiftType shift, int position, int avgTime) {
//        return estimatedTimeForPosition(shift, position, avgTime, LocalDate.now());
//    }
//
//    /**
//     * Calculates an estimated scheduled time within the shift window.
//     *
//     * For same-day bookings the baseline is max(shiftStart, now) rounded up
//     * to the next clean slot boundary — so the returned time is NEVER in the
//     * past.  For future-date bookings the baseline is always shiftStart
//     * (current time is irrelevant).
//     *
//     * Formula:  baseline + (tokensAhead * avgTime)
//     *
//     * Example (morning shift, avgTime = 10 min, user books at 10:05 AM):
//     *   minutesPast  = 65  → slotsElapsed = 6+1 = 7  → baseline = 09:00 + 70 = 10:10
//     *   0 people ahead → scheduledTime = 10:10  ✅  (was 09:00 before fix)
//     */
//    private LocalTime estimatedTimeForPosition(ShiftType shift, int position, int avgTime,
//                                               LocalDate bookingDate) {
//        LocalTime baseline = shiftStart(shift);
//
//        // For same-day bookings, never produce a slot that is already in the past
//        if (bookingDate.isEqual(LocalDate.now())) {
//            LocalTime now = LocalTime.now();
//            if (now.isAfter(baseline)) {
//                // Round up to the next clean slot boundary so the time looks neat
//                long minutesPast  = java.time.temporal.ChronoUnit.MINUTES.between(baseline, now);
//                long slotsElapsed = (minutesPast / avgTime) + 1; // +1 → next free slot
//                baseline = baseline.plusMinutes(slotsElapsed * avgTime);
//            }
//        }
//
//        LocalTime scheduled = baseline.plusMinutes((long) position * avgTime);
//
//        // Safety: never return a time past the shift end
//        LocalTime end = shiftEnd(shift);
//        if (scheduled.isAfter(end)) scheduled = end;
//
//        return scheduled;
//    }
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
//        ShiftType shift = request.getShift();
//        validateShiftIsOpen(request.getBookingDate(), shift);
//
//        // One token per user per doctor per shift per date
//        boolean alreadyBooked = tokenRepository.existsActiveTokenForUserDoctorShift(
//                user.getId(), doctor.getId(), request.getBookingDate(), shift);
//        if (alreadyBooked)
//            throw new TokenBookingException(
//                    "You already have an active token for Dr. " + doctor.getName()
//                            + " in the " + shiftLabel(shift) + " shift on "
//                            + request.getBookingDate() + ".");
//
//        // Max-token cap
//        int shiftMax   = shiftMaxTokens(shift);
//        int shiftCount = tokenRepository.countTokensForDoctorShift(
//                doctor.getId(), request.getBookingDate(), shift);
//        if (shiftCount >= shiftMax)
//            throw new TokenBookingException(
//                    "The " + shiftLabel(shift) + " shift for Dr. " + doctor.getName()
//                            + " on " + request.getBookingDate() + " is fully booked ("
//                            + shiftMax + "/" + shiftMax + " tokens). "
//                            + "Please choose the other shift.");
//
//        tokenRepository.lockDoctorQueueForDate(doctor.getId(), request.getBookingDate());
//
//        int avgTime     = doctor.getAvgConsultationTime() > 0 ? doctor.getAvgConsultationTime() : 10;
//        int nextNumber  = tokenRepository.findMaxTokenNumberByDoctorDateShift(
//                doctor.getId(), request.getBookingDate(), shift).map(m -> m + 1).orElse(1);
//        int tokensAhead   = tokenRepository.countActiveTokensAheadForDoctorShift(
//                doctor.getId(), request.getBookingDate(), shift, nextNumber);
//        int estimatedWait = tokensAhead * avgTime;
//
//        // ── Use bookingDate-aware overload so slot is never in the past ───────
//        LocalTime scheduledTime = estimatedTimeForPosition(shift, tokensAhead, avgTime, request.getBookingDate());
//        LocalTime slotEnd       = scheduledTime.plusMinutes(avgTime);
//
//        // ── 1-hour cooldown check (cross doctor + service) ───────────────────
//        validateOneHourCooldown(user.getId(), request.getBookingDate(), scheduledTime);
//
//        Token token = Token.builder()
//                .tokenNumber(nextNumber)
//                .displayToken(buildDisplayToken("D", nextNumber))
//                .bookingDate(request.getBookingDate())
//                .status(TokenStatus.BOOKED)
//                .queueType(QueueType.DOCTOR)
//                .shiftType(shift)
//                .user(user).doctor(doctor).branch(doctor.getBranch())
//                .scheduledTime(scheduledTime)
//                .slotEndTime(slotEnd)
//                .slotDurationMinutes(avgTime)
//                .estimatedWaitTimeMinutes(estimatedWait)
//                .build();
//
//        Token saved = tokenRepository.saveAndFlush(token);
//
//        log.info("Doctor token booked: {}, shift={}, position={}, scheduledTime={}, estWait={}min",
//                saved.getDisplayToken(), shift, tokensAhead, scheduledTime, estimatedWait);
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
//                .orElseThrow(() -> new ResourceNotFoundException(
//                        "Branch service not found: " + request.getBranchServiceId()));
//
//        if (!"Available".equalsIgnoreCase(bs.getStatus()))
//            throw new TokenBookingException("Service '" + bs.getName() + "' is unavailable.");
//
//        ShiftType shift = request.getShift();
//        validateShiftIsOpen(request.getBookingDate(), shift);
//
//        // One token per user per service per shift per date
//        boolean alreadyBooked = tokenRepository.existsActiveTokenForUserBranchServiceShift(
//                user.getId(), bs.getId(), request.getBookingDate(), shift);
//        if (alreadyBooked)
//            throw new TokenBookingException(
//                    "You already have an active token for '" + bs.getName()
//                            + "' in the " + shiftLabel(shift) + " shift on "
//                            + request.getBookingDate() + ".");
//
//        // Max-token cap
//        int shiftMax   = shiftMaxTokens(shift);
//        int shiftCount = tokenRepository.countTokensForBranchServiceShift(
//                bs.getId(), request.getBookingDate(), shift);
//        if (shiftCount >= shiftMax)
//            throw new TokenBookingException(
//                    "The " + shiftLabel(shift) + " shift for '" + bs.getName()
//                            + "' on " + request.getBookingDate() + " is fully booked ("
//                            + shiftMax + "/" + shiftMax + " tokens). "
//                            + "Please choose the other shift.");
//
//        tokenRepository.lockBranchServiceQueueForDate(bs.getId(), request.getBookingDate());
//
//        int avgTime    = bs.getAvgServiceTimeMinutes() != null && bs.getAvgServiceTimeMinutes() > 0
//                ? bs.getAvgServiceTimeMinutes() : 10;
//        String prefix  = getPrefixFromCategory(bs.getBranch());
//        int nextNumber = tokenRepository.findMaxTokenNumberByBranchServiceDateShift(
//                bs.getId(), request.getBookingDate(), shift).map(m -> m + 1).orElse(1);
//        int tokensAhead   = tokenRepository.countActiveTokensAheadForBranchServiceShift(
//                bs.getId(), request.getBookingDate(), shift, nextNumber);
//        int estimatedWait = tokensAhead * avgTime;
//
//        // ── Use bookingDate-aware overload so slot is never in the past ───────
//        LocalTime scheduledTime = estimatedTimeForPosition(shift, tokensAhead, avgTime, request.getBookingDate());
//        LocalTime slotEnd       = scheduledTime.plusMinutes(avgTime);
//
//        // ── 1-hour cooldown check (cross doctor + service) ───────────────────
//        validateOneHourCooldown(user.getId(), request.getBookingDate(), scheduledTime);
//
//        Token token = Token.builder()
//                .tokenNumber(nextNumber)
//                .displayToken(buildDisplayToken(prefix, nextNumber))
//                .bookingDate(request.getBookingDate())
//                .status(TokenStatus.BOOKED)
//                .queueType(QueueType.BRANCH_SERVICE)
//                .shiftType(shift)
//                .user(user).branchService(bs).branch(bs.getBranch())
//                .scheduledTime(scheduledTime)
//                .slotEndTime(slotEnd)
//                .slotDurationMinutes(avgTime)
//                .estimatedWaitTimeMinutes(estimatedWait)
//                .build();
//
//        Token saved = tokenRepository.saveAndFlush(token);
//
//        log.info("Branch service token booked: {}, shift={}, position={}, scheduledTime={}, estWait={}min",
//                saved.getDisplayToken(), shift, tokensAhead, scheduledTime, estimatedWait);
//        notificationService.notifyTokenBooked(saved);
//        return buildBranchServiceResponse(saved, tokensAhead);
//    }
//
//    // =========================================================================
//    // CANCEL — update queue positions for every token behind the cancelled one
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
//            throw new TokenBookingException(
//                    "Cannot cancel a token with status: " + token.getStatus());
//
//        token.setStatus(TokenStatus.CANCELLED);
//        tokenRepository.save(token);
//        tokenRepository.clearScheduledTime(tokenId);
//        log.info("Token {} cancelled, slot freed", token.getDisplayToken());
//
//        notificationService.notifyTokenCancelled(token);
//
//        // Shift estimated wait time and scheduled time for all tokens behind
//        List<Token> shifted = recalculateQueueAfterCancellation(token);
//        if (!shifted.isEmpty())
//            notificationService.notifyQueueShiftedAfterCancellation(shifted, resolveAvgTime(token));
//
//        ShiftType shift = token.getShiftType();
//        return TokenResponse.builder()
//                .tokenId(token.getId())
//                .displayToken(token.getDisplayToken())
//                .status(TokenStatus.CANCELLED)
//                .bookingDate(token.getBookingDate())
//                .shift(shift)
//                .shiftLabel(shift != null ? shiftLabel(shift) : null)
//                .message("Token " + token.getDisplayToken() + " cancelled. "
//                        + "Your queue position has been freed. "
//                        + shifted.size() + " user(s) behind you have been notified "
//                        + "of improved wait times.")
//                .build();
//    }
//
//    /**
//     * After a cancellation, reduce estimated wait time and shift the scheduled
//     * time forward for every BOOKED token that had a higher token number in the
//     * same shift on the same day.
//     */
//    private List<Token> recalculateQueueAfterCancellation(Token cancelledToken) {
//        List<Token> tokensToUpdate;
//        ShiftType shift = cancelledToken.getShiftType();
//
//        if (cancelledToken.getQueueType() == QueueType.DOCTOR) {
//            Doctor doctor = cancelledToken.getDoctor();
//            if (doctor == null) return List.of();
//            int avg = doctor.getAvgConsultationTime() > 0 ? doctor.getAvgConsultationTime() : 10;
//
//            tokensToUpdate = (shift != null)
//                    ? tokenRepository.findBookedTokensAfterForDoctorShift(
//                    doctor.getId(), cancelledToken.getBookingDate(),
//                    shift, cancelledToken.getTokenNumber())
//                    : tokenRepository.findBookedTokensAfterForDoctor(
//                    doctor.getId(), cancelledToken.getBookingDate(),
//                    cancelledToken.getTokenNumber());
//
//            for (Token t : tokensToUpdate) {
//                t.setEstimatedWaitTimeMinutes(
//                        Math.max(0, nullSafe(t.getEstimatedWaitTimeMinutes()) - avg));
//                if (t.getScheduledTime() != null)
//                    t.setScheduledTime(t.getScheduledTime().minusMinutes(avg));
//            }
//
//        } else {
//            BranchService bs = cancelledToken.getBranchService();
//            if (bs == null) return List.of();
//            int avg = bs.getAvgServiceTimeMinutes() != null && bs.getAvgServiceTimeMinutes() > 0
//                    ? bs.getAvgServiceTimeMinutes() : 10;
//
//            tokensToUpdate = (shift != null)
//                    ? tokenRepository.findBookedTokensAfterForBranchServiceShift(
//                    bs.getId(), cancelledToken.getBookingDate(),
//                    shift, cancelledToken.getTokenNumber())
//                    : tokenRepository.findBookedTokensAfterForBranchService(
//                    bs.getId(), cancelledToken.getBookingDate(),
//                    cancelledToken.getTokenNumber());
//
//            for (Token t : tokensToUpdate) {
//                t.setEstimatedWaitTimeMinutes(
//                        Math.max(0, nullSafe(t.getEstimatedWaitTimeMinutes()) - avg));
//                if (t.getScheduledTime() != null)
//                    t.setScheduledTime(t.getScheduledTime().minusMinutes(avg));
//            }
//        }
//
//        if (!tokensToUpdate.isEmpty()) {
//            tokenRepository.saveAll(tokensToUpdate);
//            log.info("Recalculated wait times for {} tokens after cancellation of {}",
//                    tokensToUpdate.size(), cancelledToken.getDisplayToken());
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
//                .orElseThrow(() -> new TokenBookingException(
//                        "No more tokens in queue for " + date));
//        next.setStatus(TokenStatus.IN_PROGRESS);
//        next.setServingStartedAt(LocalDateTime.now());
//        Token saved = tokenRepository.save(next);
//        Token full  = tokenRepository.findByIdWithDetails(saved.getId()).orElse(saved);
//        notificationService.notifyYourTurn(full);
//        tokenRepository.findNextTokenForDoctor(doctorId, date)
//                .ifPresent(notificationService::notifyTurnNear);
//        return buildDoctorResponse(full, 0);
//    }
//
//    @Transactional
//    public TokenResponse callNextBranchServiceToken(Long branchServiceId, LocalDate date) {
//        tokenRepository.findCurrentlyServingForBranchService(branchServiceId, date).ifPresent(t -> {
//            completeToken(t); notificationService.notifyTokenCompleted(t);
//        });
//        Token next = tokenRepository.findNextTokenForBranchService(branchServiceId, date)
//                .orElseThrow(() -> new TokenBookingException(
//                        "No more tokens in queue for " + date));
//        next.setStatus(TokenStatus.IN_PROGRESS);
//        next.setServingStartedAt(LocalDateTime.now());
//        Token saved = tokenRepository.save(next);
//        Token full  = tokenRepository.findByIdWithDetails(saved.getId()).orElse(saved);
//        notificationService.notifyYourTurn(full);
//        tokenRepository.findNextTokenForBranchService(branchServiceId, date)
//                .ifPresent(notificationService::notifyTurnNear);
//        return buildBranchServiceResponse(full, 0);
//    }
//
//    private void completeToken(Token t) {
//        t.setStatus(TokenStatus.COMPLETED);
//        t.setServingCompletedAt(LocalDateTime.now());
//        if (t.getServingStartedAt() != null)
//            t.setActualWaitTimeMinutes(
//                    (int) Duration.between(t.getServingStartedAt(), LocalDateTime.now()).toMinutes());
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
//                .waitingCount(q.stream().filter(t ->
//                        t.getStatus() == TokenStatus.BOOKED ||
//                                t.getStatus() == TokenStatus.CALLED).count())
//                .completedCount(q.stream().filter(t ->
//                        t.getStatus() == TokenStatus.COMPLETED).count())
//                .currentlyServingToken(tokenRepository
//                        .findCurrentlyServingForDoctor(doctorId, date)
//                        .map(Token::getDisplayToken).orElse("None"))
//                .build();
//    }
//
//    @Transactional(readOnly = true)
//    public QueueStatusResponse getBranchServiceQueueStatus(Long branchServiceId, LocalDate date) {
//        List<Token> q = tokenRepository.findBranchServiceQueueForDate(branchServiceId, date);
//        return QueueStatusResponse.builder()
//                .totalTokens((long) q.size())
//                .waitingCount(q.stream().filter(t ->
//                        t.getStatus() == TokenStatus.BOOKED ||
//                                t.getStatus() == TokenStatus.CALLED).count())
//                .completedCount(q.stream().filter(t ->
//                        t.getStatus() == TokenStatus.COMPLETED).count())
//                .currentlyServingToken(tokenRepository
//                        .findCurrentlyServingForBranchService(branchServiceId, date)
//                        .map(Token::getDisplayToken).orElse("None"))
//                .build();
//    }
//
//    // =========================================================================
//    // USER HISTORY
//    // =========================================================================
//
//    @Transactional(readOnly = true)
//    public List<TokenResponse> getUserTokenHistory(Long userId) {
//        return tokenRepository.findAllByUserId(userId)
//                .stream().map(this::buildGenericResponse).toList();
//    }
//
//    @Transactional(readOnly = true)
//    public List<TokenResponse> getUserActiveTokens(Long userId) {
//        return tokenRepository.findActiveTokensByUserId(userId, LocalDate.now())
//                .stream().map(token -> {
//                    int liveAhead, avgTime;
//                    ShiftType shift = token.getShiftType();
//
//                    if (token.getQueueType() == QueueType.DOCTOR && token.getDoctor() != null) {
//                        liveAhead = (shift != null)
//                                ? tokenRepository.countActiveTokensAheadForDoctorShift(
//                                token.getDoctor().getId(), token.getBookingDate(),
//                                shift, token.getTokenNumber())
//                                : tokenRepository.countActiveTokensAheadForDoctor(
//                                token.getDoctor().getId(), token.getBookingDate(),
//                                token.getTokenNumber());
//                        avgTime = token.getDoctor().getAvgConsultationTime() > 0
//                                ? token.getDoctor().getAvgConsultationTime() : 10;
//                    } else if (token.getBranchService() != null) {
//                        liveAhead = (shift != null)
//                                ? tokenRepository.countActiveTokensAheadForBranchServiceShift(
//                                token.getBranchService().getId(), token.getBookingDate(),
//                                shift, token.getTokenNumber())
//                                : tokenRepository.countActiveTokensAheadForBranchService(
//                                token.getBranchService().getId(), token.getBookingDate(),
//                                token.getTokenNumber());
//                        avgTime = token.getBranchService().getAvgServiceTimeMinutes() != null
//                                && token.getBranchService().getAvgServiceTimeMinutes() > 0
//                                ? token.getBranchService().getAvgServiceTimeMinutes() : 10;
//                    } else { liveAhead = 0; avgTime = 10; }
//
//                    token.setEstimatedWaitTimeMinutes(liveAhead * avgTime);
//                    if (shift != null)
//                        // today's live refresh — always uses now-aware overload
//                        token.setScheduledTime(estimatedTimeForPosition(shift, liveAhead, avgTime));
//
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
//    /**
//     * Blocks booking if the new token's scheduledTime falls within ±60 minutes
//     * of ANY existing active token (doctor or service) for this user on this date.
//     *
//     * Example: existing token at 09:10 AM → blocks 08:10 AM – 10:10 AM (exclusive).
//     *
//     * Edge cases handled:
//     *  - newScheduledTime == null  → skip (walk-in tokens have no fixed slot)
//     *  - existing token has null scheduledTime → skip that token (can't compare)
//     *  - Minute diff uses ChronoUnit.MINUTES with explicit min/max ordering
//     *    so the result is always positive regardless of which time is earlier.
//     */
//    private void validateOneHourCooldown(Long userId, LocalDate bookingDate, LocalTime newScheduledTime) {
//        if (newScheduledTime == null) return;
//
//        List<Token> existing = tokenRepository
//                .findActiveTokensWithScheduledTimeForUserOnDate(userId, bookingDate);
//
//        for (Token t : existing) {
//            LocalTime existingTime = t.getScheduledTime();
//            if (existingTime == null) continue; // safety guard
//
//            // Always compute a positive minute difference regardless of ordering
//            long diffMinutes = java.time.temporal.ChronoUnit.MINUTES.between(
//                    existingTime.isBefore(newScheduledTime) ? existingTime : newScheduledTime,
//                    existingTime.isBefore(newScheduledTime) ? newScheduledTime : existingTime
//            );
//
//            if (diffMinutes < 60) {
//                String existingLabel = t.getQueueType() == QueueType.DOCTOR
//                        ? "Dr. " + (t.getDoctor() != null ? t.getDoctor().getName() : "Unknown")
//                        : (t.getBranchService() != null ? t.getBranchService().getName() : "Unknown service");
//
//                LocalTime blockedFrom = existingTime.minusHours(1);
//                LocalTime blockedTo   = existingTime.plusHours(1);
//
//                throw new TokenBookingException(
//                        "You already have a booking for \"" + existingLabel
//                                + "\" at " + formatTime(existingTime) + "."
//                                + " Your new token would be at " + formatTime(newScheduledTime)
//                                + ", which is only " + diffMinutes + " minute(s) away."
//                                + " You cannot book any token within 1 hour before or after an existing booking."
//                                + " Please choose a time outside " + formatTime(blockedFrom)
//                                + " – " + formatTime(blockedTo) + "."
//                );
//            }
//        }
//    }
//
//    // =========================================================================
//    // HELPERS
//    // =========================================================================
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
//            return token.getDoctor().getAvgConsultationTime() > 0
//                    ? token.getDoctor().getAvgConsultationTime() : 10;
//        if (token.getBranchService() != null
//                && token.getBranchService().getAvgServiceTimeMinutes() != null
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
//        ShiftType shift = t.getShiftType();
//        String sl = shift != null ? shiftLabel(shift) : null;
//        return TokenResponse.builder()
//                .tokenId(t.getId()).displayToken(t.getDisplayToken()).tokenNumber(t.getTokenNumber())
//                .queuePosition(queuePos).estimatedWaitTimeMinutes(t.getEstimatedWaitTimeMinutes())
//                .scheduledTime(t.getScheduledTime()).slotEndTime(slotEnd)
//                .slotDurationMinutes(t.getSlotDurationMinutes())
//                .shift(shift).shiftLabel(sl)
//                .queueType(t.getQueueType()).status(t.getStatus()).bookingDate(t.getBookingDate())
//                .doctorId(d.getId()).doctorName(d.getName())
//                .doctorSpecialization(d.getSpecialization()).doctorTiming(d.getTiming())
//                .branchId(b.getId()).branchName(b.getName()).branchLocation(b.getLocation())
//                .userId(u.getId()).userName(u.getUsername()).bookedAt(t.getCreatedAt())
//                .message("Token " + t.getDisplayToken() + " booked for " + sl + "! "
//                        + "Est. wait: " + t.getEstimatedWaitTimeMinutes() + " min."
//                        + (t.getScheduledTime() != null
//                        ? " Your est. slot: " + formatTime(t.getScheduledTime())
//                          + " – " + formatTime(slotEnd) : ""))
//                .build();
//    }
//
//    private TokenResponse buildBranchServiceResponse(Token t, int queuePos) {
//        BranchService bs = t.getBranchService(); Branch b = t.getBranch(); User u = t.getUser();
//        LocalTime slotEnd = t.getScheduledTime() != null
//                ? t.getScheduledTime().plusMinutes(nullSafe(t.getSlotDurationMinutes())) : null;
//        ShiftType shift = t.getShiftType();
//        String sl = shift != null ? shiftLabel(shift) : null;
//        return TokenResponse.builder()
//                .tokenId(t.getId()).displayToken(t.getDisplayToken()).tokenNumber(t.getTokenNumber())
//                .queuePosition(queuePos).estimatedWaitTimeMinutes(t.getEstimatedWaitTimeMinutes())
//                .scheduledTime(t.getScheduledTime()).slotEndTime(slotEnd)
//                .slotDurationMinutes(t.getSlotDurationMinutes())
//                .shift(shift).shiftLabel(sl)
//                .queueType(t.getQueueType()).status(t.getStatus()).bookingDate(t.getBookingDate())
//                .branchServiceId(bs.getId()).branchServiceName(bs.getName())
//                .branchServiceCounter(bs.getCounter()).branchServiceTiming(bs.getTiming())
//                .branchId(b.getId()).branchName(b.getName()).branchLocation(b.getLocation())
//                .userId(u.getId()).userName(u.getUsername()).bookedAt(t.getCreatedAt())
//                .message("Token " + t.getDisplayToken() + " booked for " + sl + "! "
//                        + "Est. wait: " + t.getEstimatedWaitTimeMinutes() + " min."
//                        + (t.getScheduledTime() != null
//                        ? " Your est. slot: " + formatTime(t.getScheduledTime())
//                          + " – " + formatTime(slotEnd) : ""))
//                .build();
//    }
//
//    private TokenResponse buildGenericResponse(Token t) {
//        int ahead = 0;
//        ShiftType shift = t.getShiftType();
//        if (t.getQueueType() == QueueType.DOCTOR && t.getDoctor() != null)
//            ahead = (shift != null)
//                    ? tokenRepository.countActiveTokensAheadForDoctorShift(
//                    t.getDoctor().getId(), t.getBookingDate(), shift, t.getTokenNumber())
//                    : tokenRepository.countActiveTokensAheadForDoctor(
//                    t.getDoctor().getId(), t.getBookingDate(), t.getTokenNumber());
//        else if (t.getBranchService() != null)
//            ahead = (shift != null)
//                    ? tokenRepository.countActiveTokensAheadForBranchServiceShift(
//                    t.getBranchService().getId(), t.getBookingDate(), shift, t.getTokenNumber())
//                    : tokenRepository.countActiveTokensAheadForBranchService(
//                    t.getBranchService().getId(), t.getBookingDate(), t.getTokenNumber());
//        return t.getQueueType() == QueueType.DOCTOR
//                ? buildDoctorResponse(t, ahead) : buildBranchServiceResponse(t, ahead);
//    }
//
//    // =========================================================================
//    // USER HISTORY SOFT-DELETE
//    // =========================================================================
//
//    @Transactional
//    public void deleteFromUserHistory(Long tokenId, Long userId) {
//        Token token = tokenRepository.findById(tokenId)
//                .orElseThrow(() -> new ResourceNotFoundException("Token not found: " + tokenId));
//        if (!token.getUser().getId().equals(userId)) {
//            throw new BadRequestException("You are not authorized to delete this token.");
//        }
//        Token.TokenStatus s = token.getStatus();
//        if (s == Token.TokenStatus.BOOKED
//                || s == Token.TokenStatus.CALLED
//                || s == Token.TokenStatus.IN_PROGRESS) {
//            throw new BadRequestException(
//                    "Active tokens (Upcoming/Called/In Progress) cannot be removed from history.");
//        }
//        token.setDeletedByUser(true);
//        tokenRepository.save(token);
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
import com.example.Queue_Master.exception.BadRequestException;
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

    private static final LocalTime MORNING_START   = LocalTime.of(9, 0);
    private static final LocalTime MORNING_END     = LocalTime.of(13, 0);
    private static final int       MORNING_MAX     = 20;

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

    private void validateShiftIsOpen(LocalDate date, ShiftType shift) {
        if (!date.isEqual(LocalDate.now())) return;
        LocalTime now = LocalTime.now();
        LocalTime end = shiftEnd(shift);
        if (now.isAfter(end))
            throw new TokenBookingException(
                    shiftLabel(shift) + " shift has already ended for today.");
    }

    /**
     * ✅ FIXED: Removed the 2-param overload that incorrectly hardcoded LocalDate.now().
     * All callers now explicitly pass the booking date, so future-date tokens
     * always use shiftStart as the baseline instead of an advanced "now-based" baseline.
     *
     * Formula:  baseline + (tokensAhead * avgTime)
     *
     * For same-day bookings: baseline = max(shiftStart, now) rounded to next clean slot.
     * For future-date bookings: baseline = shiftStart (current time is irrelevant).
     */
    private LocalTime estimatedTimeForPosition(ShiftType shift, int position, int avgTime,
                                               LocalDate bookingDate) {
        LocalTime baseline = shiftStart(shift);

        if (bookingDate.isEqual(LocalDate.now())) {
            LocalTime now = LocalTime.now();
            if (now.isAfter(baseline)) {
                long minutesPast  = java.time.temporal.ChronoUnit.MINUTES.between(baseline, now);
                long slotsElapsed = (minutesPast / avgTime) + 1;
                baseline = baseline.plusMinutes(slotsElapsed * avgTime);
            }
        }

        LocalTime scheduled = baseline.plusMinutes((long) position * avgTime);

        LocalTime end = shiftEnd(shift);
        if (scheduled.isAfter(end)) scheduled = end;

        return scheduled;
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

        boolean alreadyBooked = tokenRepository.existsActiveTokenForUserDoctorShift(
                user.getId(), doctor.getId(), request.getBookingDate(), shift);
        if (alreadyBooked)
            throw new TokenBookingException(
                    "You already have an active token for Dr. " + doctor.getName()
                            + " in the " + shiftLabel(shift) + " shift on "
                            + request.getBookingDate() + ".");

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

        LocalTime scheduledTime = estimatedTimeForPosition(shift, tokensAhead, avgTime, request.getBookingDate());
        LocalTime slotEnd       = scheduledTime.plusMinutes(avgTime);

        validateOneHourCooldown(user.getId(), request.getBookingDate(), scheduledTime);

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

        log.info("Doctor token booked: {}, shift={}, position={}, scheduledTime={}, estWait={}min",
                saved.getDisplayToken(), shift, tokensAhead, scheduledTime, estimatedWait);
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

        boolean alreadyBooked = tokenRepository.existsActiveTokenForUserBranchServiceShift(
                user.getId(), bs.getId(), request.getBookingDate(), shift);
        if (alreadyBooked)
            throw new TokenBookingException(
                    "You already have an active token for '" + bs.getName()
                            + "' in the " + shiftLabel(shift) + " shift on "
                            + request.getBookingDate() + ".");

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

        LocalTime scheduledTime = estimatedTimeForPosition(shift, tokensAhead, avgTime, request.getBookingDate());
        LocalTime slotEnd       = scheduledTime.plusMinutes(avgTime);

        validateOneHourCooldown(user.getId(), request.getBookingDate(), scheduledTime);

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

        log.info("Branch service token booked: {}, shift={}, position={}, scheduledTime={}, estWait={}min",
                saved.getDisplayToken(), shift, tokensAhead, scheduledTime, estimatedWait);
        notificationService.notifyTokenBooked(saved);
        return buildBranchServiceResponse(saved, tokensAhead);
    }

    // =========================================================================
    // CANCEL
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
    // USER HISTORY
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
                        // ✅ FIX: pass token.getBookingDate() instead of hardcoded LocalDate.now()
                        // so future-date tokens use shiftStart as baseline, not today's current time
                        token.setScheduledTime(estimatedTimeForPosition(shift, liveAhead, avgTime, token.getBookingDate()));

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

    private void validateOneHourCooldown(Long userId, LocalDate bookingDate, LocalTime newScheduledTime) {
        if (newScheduledTime == null) return;

        List<Token> existing = tokenRepository
                .findActiveTokensWithScheduledTimeForUserOnDate(userId, bookingDate);

        for (Token t : existing) {
            LocalTime existingTime = t.getScheduledTime();
            if (existingTime == null) continue;

            long diffMinutes = java.time.temporal.ChronoUnit.MINUTES.between(
                    existingTime.isBefore(newScheduledTime) ? existingTime : newScheduledTime,
                    existingTime.isBefore(newScheduledTime) ? newScheduledTime : existingTime
            );

            if (diffMinutes < 60) {
                String existingLabel = t.getQueueType() == QueueType.DOCTOR
                        ? "Dr. " + (t.getDoctor() != null ? t.getDoctor().getName() : "Unknown")
                        : (t.getBranchService() != null ? t.getBranchService().getName() : "Unknown service");

                LocalTime blockedFrom = existingTime.minusHours(1);
                LocalTime blockedTo   = existingTime.plusHours(1);

                throw new TokenBookingException(
                        "You already have a booking for \"" + existingLabel
                                + "\" at " + formatTime(existingTime) + "."
                                + " Your new token would be at " + formatTime(newScheduledTime)
                                + ", which is only " + diffMinutes + " minute(s) away."
                                + " You cannot book any token within 1 hour before or after an existing booking."
                                + " Please choose a time outside " + formatTime(blockedFrom)
                                + " – " + formatTime(blockedTo) + "."
                );
            }
        }
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

    // =========================================================================
    // USER HISTORY SOFT-DELETE
    // =========================================================================

    @Transactional
    public void deleteFromUserHistory(Long tokenId, Long userId) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found: " + tokenId));
        if (!token.getUser().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to delete this token.");
        }
        Token.TokenStatus s = token.getStatus();
        if (s == Token.TokenStatus.BOOKED
                || s == Token.TokenStatus.CALLED
                || s == Token.TokenStatus.IN_PROGRESS) {
            throw new BadRequestException(
                    "Active tokens (Upcoming/Called/In Progress) cannot be removed from history.");
        }
        token.setDeletedByUser(true);
        tokenRepository.save(token);
    }
}
