package com.example.Queue_Master.service;

import com.example.Queue_Master.entity.Token;
import com.example.Queue_Master.entity.UserNotification;
import com.example.Queue_Master.entity.UserNotification.NotificationType;
import com.example.Queue_Master.repository.UserNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserNotificationService {

    private final UserNotificationRepository notificationRepository;

    // =========================================================================
    // NOTIFICATION TRIGGERS (called from TokenService)
    // =========================================================================

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void notifyTokenBooked(Token token) {
        if (token.getUser() == null) return;
        String msg = String.format(
                "✅ Token %s booked! Date: %s | Shift: %s | Est. wait: %d min.",
                token.getDisplayToken(),
                token.getBookingDate(),
                token.getShiftType(),
                token.getEstimatedWaitTimeMinutes() != null ? token.getEstimatedWaitTimeMinutes() : 0
        );
        save(token, NotificationType.TOKEN_BOOKED, msg);
        log.info("[NOTIFY] Token booked: {} | User: {}", token.getDisplayToken(),
                token.getUser().getUsername());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void notifyTokenCancelled(Token token) {
        if (token.getUser() == null) return;
        String msg = String.format(
                "❌ Your token %s has been cancelled.",
                token.getDisplayToken()
        );
        save(token, NotificationType.TOKEN_CANCELLED, msg);
        log.info("[NOTIFY] Token cancelled: {} | User: {}", token.getDisplayToken(),
                token.getUser().getUsername());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void notifyYourTurn(Token token) {
        if (token.getUser() == null) return;
        String msg = String.format(
                "🔔 It's your turn now! Token %s — please proceed to the counter.",
                token.getDisplayToken()
        );
        save(token, NotificationType.YOUR_TURN, msg);
        log.info("[NOTIFY] Your turn now: {} | User: {}", token.getDisplayToken(),
                token.getUser().getUsername());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void notifyTurnNear(Token token) {
        if (token.getUser() == null) return;
        String msg = String.format(
                "⏰ Your turn is coming soon! Token %s — please be ready.",
                token.getDisplayToken()
        );
        save(token, NotificationType.TURN_NEAR, msg);
        log.info("[NOTIFY] Turn coming soon: {} | User: {}", token.getDisplayToken(),
                token.getUser().getUsername());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void notifyTokenCompleted(Token token) {
        if (token.getUser() == null) return;
        String msg = String.format(
                "✔️ Token %s has been completed. Thank you!",
                token.getDisplayToken()
        );
        save(token, NotificationType.TOKEN_COMPLETED, msg);
        log.info("[NOTIFY] Token completed: {} | User: {}", token.getDisplayToken(),
                token.getUser().getUsername());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void notifyQueueShiftedAfterCancellation(List<Token> shiftedTokens, int avgTime) {
        for (Token token : shiftedTokens) {
            if (token.getUser() == null) continue;
            String msg = String.format(
                    "🎉 Good news! Someone ahead of you cancelled. Token %s moved up by ~%d min.",
                    token.getDisplayToken(),
                    avgTime
            );
            save(token, NotificationType.QUEUE_SHIFTED, msg);
            log.info("[NOTIFY] Queue shifted (~{} min improvement): {} | User: {}",
                    avgTime, token.getDisplayToken(), token.getUser().getUsername());
        }
    }

    // =========================================================================
    // CRUD — used by NotificationController
    // =========================================================================

    @Transactional(readOnly = true)
    public List<UserNotification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllReadByUserId(userId);
    }

    @Transactional
    public void markOneRead(Long notifId) {
        notificationRepository.findById(notifId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void deleteOne(Long notifId) {
        notificationRepository.deleteById(notifId);
    }

    @Transactional
    public void deleteAllForUser(Long userId) {
        notificationRepository.deleteByUserId(userId);
    }

    // =========================================================================
    // INTERNAL HELPER
    // =========================================================================

    private void save(Token token, NotificationType type, String message) {
        UserNotification n = UserNotification.builder()
                .user(token.getUser())
                .displayToken(token.getDisplayToken())
                .type(type)
                .message(message)
                .read(false)
                .build();
        notificationRepository.save(n);
    }
}