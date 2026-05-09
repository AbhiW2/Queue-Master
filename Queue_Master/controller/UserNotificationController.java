package com.example.Queue_Master.controller;

import com.example.Queue_Master.dto.NotificationResponse;
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
public class UserNotificationController {

    private final UserNotificationService notifService;

    /**
     * GET /api/v1/notifications/user/{userId}
     * Returns all notifications (max 50), newest first.
     * Frontend polls this every 20s to refresh the bell drawer.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @PathVariable Long userId) {
        return ResponseEntity.ok(notifService.getNotifications(userId));
    }

    /**
     * GET /api/v1/notifications/user/{userId}/unread-count
     * Lightweight poll — returns just the unread count for the badge.
     * Frontend polls this every 10s to update the red badge on the bell.
     */
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long userId) {
        long count = notifService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    /**
     * PUT /api/v1/notifications/user/{userId}/mark-all-read
     * Called when user opens the notification drawer.
     */
    @PutMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<Void> markAllRead(@PathVariable Long userId) {
        notifService.markAllRead(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * PUT /api/v1/notifications/{notificationId}/mark-read
     * Mark a single notification as read.
     */
    @PutMapping("/{notificationId}/mark-read")
    public ResponseEntity<Void> markRead(@PathVariable Long notificationId) {
        notifService.markRead(notificationId);
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/v1/notifications/{notificationId}
     * Permanently delete one notification.
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteOne(@PathVariable Long notificationId) {
        notifService.deleteOne(notificationId);
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/v1/notifications/user/{userId}/all
     * Permanently delete ALL notifications for a user (Clear All button).
     */
    @DeleteMapping("/user/{userId}/all")
    public ResponseEntity<Void> deleteAll(@PathVariable Long userId) {
        notifService.deleteAll(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/v1/notifications/user/{userId}/cleanup
     * Deletes old read notifications (> 7 days). Call periodically.
     */
    @DeleteMapping("/user/{userId}/cleanup")
    public ResponseEntity<Void> cleanup(@PathVariable Long userId) {
        notifService.cleanupOldNotifications(userId);
        return ResponseEntity.ok().build();
    }
}