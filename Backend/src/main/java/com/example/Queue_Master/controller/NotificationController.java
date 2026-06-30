package com.example.Queue_Master.controller;

import com.example.Queue_Master.entity.UserNotification;
import com.example.Queue_Master.service.UserNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final UserNotificationService notificationService;

    /**
     * GET /api/v1/notifications/user/{userId}
     * Returns all notifications for a user (newest first).
     * Frontend useNotifications.js polls this every 20s.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserNotification>> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }

    /**
     * GET /api/v1/notifications/user/{userId}/unread-count
     * Returns { "unreadCount": N } — used by the badge poll every 10s.
     */
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    /**
     * PUT /api/v1/notifications/user/{userId}/mark-all-read
     * Marks every notification for this user as read.
     */
    @PutMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<Void> markAllRead(@PathVariable Long userId) {
        notificationService.markAllRead(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /api/v1/notifications/{notifId}/mark-read
     * Marks a single notification as read.
     */
    @PutMapping("/{notifId}/mark-read")
    public ResponseEntity<Void> markOneRead(@PathVariable Long notifId) {
        notificationService.markOneRead(notifId);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/v1/notifications/{notifId}
     * Dismisses (hard-deletes) a single notification.
     */
    @DeleteMapping("/{notifId}")
    public ResponseEntity<Void> deleteOne(@PathVariable Long notifId) {
        notificationService.deleteOne(notifId);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/v1/notifications/user/{userId}/all
     * Clears all notifications for a user.
     */
    @DeleteMapping("/user/{userId}/all")
    public ResponseEntity<Void> deleteAll(@PathVariable Long userId) {
        notificationService.deleteAllForUser(userId);
        return ResponseEntity.noContent().build();
    }
}