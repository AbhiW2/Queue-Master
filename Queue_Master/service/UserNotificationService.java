package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.NotificationResponse;
import com.example.Queue_Master.entity.Token;
import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.entity.UserNotification;
import com.example.Queue_Master.entity.UserNotification.NotificationType;
import com.example.Queue_Master.repository.TokenRepository;
import com.example.Queue_Master.repository.UserNotificationRepository;
import com.example.Queue_Master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserNotificationService {

    private static final int  NEAR_THRESHOLD    = 2;    // notify when ≤ 2 people ahead
    private static final long DEDUP_SECONDS     = 60;   // suppress duplicate within 60s

    private final UserNotificationRepository notifRepo;
    private final TokenRepository            tokenRepo;
    private final UserRepository             userRepo;

    // ── Internal helper — save one notification ──────────────

    private void save(User user, Long tokenId, String displayToken,
                      NotificationType type, String title, String message) {

        // Dedup: skip if same type for same token was already sent within DEDUP_SECONDS
        if (tokenId != null) {
            boolean recent = notifRepo.existsRecentNotification(
                    user.getId(), tokenId, type,
                    LocalDateTime.now().minusSeconds(DEDUP_SECONDS));
            if (recent) {
                log.debug("Skipping duplicate notification type={} tokenId={}", type, tokenId);
                return;
            }
        }

        UserNotification n = UserNotification.builder()
                .user(user)
                .tokenId(tokenId)
                .displayToken(displayToken)
                .type(type)
                .title(title)
                .message(message)
                .read(false)
                .build();

        notifRepo.save(n);
        log.info("Notification saved → userId={} type={} token={}", user.getId(), type, displayToken);
    }

    // ══════════════════════════════════════════════════════════
    //  PUBLIC — called from TokenService on every key event
    // ══════════════════════════════════════════════════════════

    /**
     * Called right after a token is booked successfully.
     */
    @Transactional
    public void notifyTokenBooked(Token token) {
        String serviceName = resolveServiceName(token);
        String title       = "✅ Token Booked Successfully";
        String message     = String.format(
                "Token %s booked for %s on %s. Estimated wait: %d min.",
                token.getDisplayToken(),
                serviceName,
                token.getBookingDate(),
                token.getEstimatedWaitTimeMinutes() != null ? token.getEstimatedWaitTimeMinutes() : 0
        );
        save(token.getUser(), token.getId(), token.getDisplayToken(),
                NotificationType.TOKEN_BOOKED, title, message);
    }

    /**
     * Called right after a token is cancelled by the user.
     */
    @Transactional
    public void notifyTokenCancelled(Token token) {
        String title   = "❌ Token Cancelled";
        String message = String.format(
                "Your token %s has been cancelled. Queue ahead of you has been updated.",
                token.getDisplayToken()
        );
        save(token.getUser(), token.getId(), token.getDisplayToken(),
                NotificationType.TOKEN_CANCELLED, title, message);
    }

    /**
     * Called after a cancellation shifts the queue.
     * Notifies all BOOKED users whose wait time was reduced.
     *
     * @param updatedTokens  list of tokens whose estimatedWaitTimeMinutes was just reduced
     * @param avgTime        minutes subtracted from each
     */
    @Transactional
    public void notifyQueueShiftedAfterCancellation(List<Token> updatedTokens, int avgTime) {
        for (Token t : updatedTokens) {
            if (t.getUser() == null) continue;

            int newWait      = t.getEstimatedWaitTimeMinutes() != null ? t.getEstimatedWaitTimeMinutes() : 0;
            int position     = t.getTokenNumber() - 1; // 0-indexed position
            String serviceName = resolveServiceName(t);

            // ── Case 1: Now ≤ NEAR_THRESHOLD people ahead → "Turn is near" ──
            if (position <= NEAR_THRESHOLD && position >= 0) {
                String title   = "⏳ Your Turn is Near!";
                String message = String.format(
                        "Only %d person%s ahead of you for %s (Token %s). Please be ready!",
                        position,
                        position == 1 ? "" : "s",
                        serviceName,
                        t.getDisplayToken()
                );
                save(t.getUser(), t.getId(), t.getDisplayToken(),
                        NotificationType.TURN_NEAR, title, message);

                // ── Case 2: Queue moved forward → "Queue updated" ──
            } else {
                String title   = "📋 Queue Updated";
                String message = String.format(
                        "Someone cancelled ahead of you for %s (Token %s). "
                                + "New estimated wait: %d min.",
                        serviceName,
                        t.getDisplayToken(),
                        newWait
                );
                save(t.getUser(), t.getId(), t.getDisplayToken(),
                        NotificationType.QUEUE_UPDATED, title, message);
            }
        }
    }

    /**
     * Called when staff calls next token (IN_PROGRESS or CALLED).
     * Notifies the token owner it's their turn.
     */
    @Transactional
    public void notifyYourTurn(Token token) {
        String serviceName = resolveServiceName(token);
        String title       = "🔔 It's Your Turn!";
        String message     = String.format(
                "Token %s is now being served for %s. Please proceed to the counter immediately.",
                token.getDisplayToken(),
                serviceName
        );
        save(token.getUser(), token.getId(), token.getDisplayToken(),
                NotificationType.YOUR_TURN, title, message);
    }

    /**
     * Called when the token just BEFORE this user's token is called.
     * i.e., only 1 person ahead now → "Turn is near".
     */
    @Transactional
    public void notifyTurnNear(Token token) {
        if (token.getUser() == null) return;
        String serviceName = resolveServiceName(token);
        String title       = "⏳ Your Turn is Very Near!";
        String message     = String.format(
                "The person just before you is now being served for %s. "
                        + "Token %s — please be ready!",
                serviceName,
                token.getDisplayToken()
        );
        save(token.getUser(), token.getId(), token.getDisplayToken(),
                NotificationType.TURN_NEAR, title, message);
    }

    /**
     * Called when a token is marked COMPLETED.
     */
    @Transactional
    public void notifyTokenCompleted(Token token) {
        String serviceName = resolveServiceName(token);
        String title       = "✅ Service Completed";
        String message     = String.format(
                "Your service for %s (Token %s) has been completed. Thank you for using QueueMaster!",
                serviceName,
                token.getDisplayToken()
        );
        save(token.getUser(), token.getId(), token.getDisplayToken(),
                NotificationType.TOKEN_COMPLETED, title, message);
    }

    // ══════════════════════════════════════════════════════════
    //  PUBLIC — called from controller (read / fetch)
    // ══════════════════════════════════════════════════════════

    /** All notifications for user, newest first (max 50). */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(Long userId) {
        return notifRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .limit(50)
                .map(this::toDto)
                .toList();
    }

    /** Unread count only — lightweight poll. */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notifRepo.countUnreadByUserId(userId);
    }

    /** Mark all notifications read for a user. */
    @Transactional
    public void markAllRead(Long userId) {
        notifRepo.markAllReadByUserId(userId);
    }

    /** Mark a single notification read. */
    @Transactional
    public void markRead(Long notificationId) {
        notifRepo.markReadById(notificationId);
    }

    /** Delete a single notification permanently from DB. */
    @Transactional
    public void deleteOne(Long notificationId) {
        notifRepo.deleteNotificationById(notificationId);
    }

    /** Delete ALL notifications for a user permanently (clear all). */
    @Transactional
    public void deleteAll(Long userId) {
        notifRepo.deleteAllByUserId(userId);
    }

    /** Delete all read notifications older than 7 days for a user. */
    @Transactional
    public void cleanupOldNotifications(Long userId) {
        notifRepo.deleteOldReadNotifications(
                userId,
                LocalDateTime.now().minusDays(7)
        );
    }

    // ── Private helpers ───────────────────────────────────────

    private String resolveServiceName(Token token) {
        if (token.getDoctor() != null) {
            return "Dr. " + token.getDoctor().getName();
        }
        if (token.getBranchService() != null) {
            return token.getBranchService().getName();
        }
        return "Service";
    }

    private NotificationResponse toDto(UserNotification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .tokenId(n.getTokenId())
                .displayToken(n.getDisplayToken())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }

    public TokenRepository getTokenRepo() {
        return tokenRepo;
    }

    public UserRepository getUserRepo() {
        return userRepo;
    }
}