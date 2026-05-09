//package com.example.Queue_Master.repository;
//
//import com.example.Queue_Master.entity.UserNotification;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Modifying;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Repository
//public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {
//
//    // All notifications for a user, newest first
//    @Query("SELECT n FROM UserNotification n " +
//            "WHERE n.user.id = :userId " +
//            "ORDER BY n.createdAt DESC")
//    List<UserNotification> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
//
//    // Only unread
//    @Query("SELECT n FROM UserNotification n " +
//            "WHERE n.user.id = :userId AND n.read = false " +
//            "ORDER BY n.createdAt DESC")
//    List<UserNotification> findUnreadByUserId(@Param("userId") Long userId);
//
//    // Unread count
//    @Query("SELECT COUNT(n) FROM UserNotification n " +
//            "WHERE n.user.id = :userId AND n.read = false")
//    long countUnreadByUserId(@Param("userId") Long userId);
//
//    // Mark all as read for a user
//    @Modifying
//    @Query("UPDATE UserNotification n SET n.read = true " +
//            "WHERE n.user.id = :userId AND n.read = false")
//    void markAllReadByUserId(@Param("userId") Long userId);
//
//    // Mark one as read
//    @Modifying
//    @Query("UPDATE UserNotification n SET n.read = true WHERE n.id = :id")
//    void markReadById(@Param("id") Long id);
//
//    // Check duplicate — prevent same type notification for same token within 1 minute
//    @Query("SELECT COUNT(n) > 0 FROM UserNotification n " +
//            "WHERE n.user.id = :userId " +
//            "  AND n.tokenId = :tokenId " +
//            "  AND n.type = :type " +
//            "  AND n.createdAt >= :since")
//    boolean existsRecentNotification(
//            @Param("userId")  Long userId,
//            @Param("tokenId") Long tokenId,
//            @Param("type")    UserNotification.NotificationType type,
//            @Param("since")   LocalDateTime since);
//
//    // Delete one notification by id
//    @Modifying
//    @Query("DELETE FROM UserNotification n WHERE n.id = :id")
//    void deleteNotificationById(@Param("id") Long id);
//
//    // Delete ALL notifications for a user (clear all)
//    @Modifying
//    @Query("DELETE FROM UserNotification n WHERE n.user.id = :userId")
//    void deleteAllByUserId(@Param("userId") Long userId);
//
//    // Delete old read notifications (for cleanup)
//    @Modifying
//    @Query("DELETE FROM UserNotification n " +
//            "WHERE n.user.id = :userId AND n.read = true " +
//            "AND n.createdAt < :before")
//    void deleteOldReadNotifications(
//            @Param("userId") Long userId,
//            @Param("before") LocalDateTime before);
//    // Delete all notifications for tokens belonging to a branch (used before branch delete)
//    @Modifying
//    @Query(value = "DELETE FROM user_notifications WHERE token_id IN " +
//            "(SELECT id FROM tokens WHERE branch_id = :branchId)", nativeQuery = true)
//    void deleteAllByBranchIdNative(@Param("branchId") Long branchId);
//}














package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {

    @Query("SELECT n FROM UserNotification n " +
            "WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    List<UserNotification> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT n FROM UserNotification n " +
            "WHERE n.user.id = :userId AND n.read = false ORDER BY n.createdAt DESC")
    List<UserNotification> findUnreadByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(n) FROM UserNotification n " +
            "WHERE n.user.id = :userId AND n.read = false")
    long countUnreadByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE UserNotification n SET n.read = true " +
            "WHERE n.user.id = :userId AND n.read = false")
    void markAllReadByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE UserNotification n SET n.read = true WHERE n.id = :id")
    void markReadById(@Param("id") Long id);

    @Query("SELECT COUNT(n) > 0 FROM UserNotification n " +
            "WHERE n.user.id = :userId " +
            "  AND n.tokenId = :tokenId " +
            "  AND n.type = :type " +
            "  AND n.createdAt >= :since")
    boolean existsRecentNotification(
            @Param("userId")  Long userId,
            @Param("tokenId") Long tokenId,
            @Param("type")    UserNotification.NotificationType type,
            @Param("since")   LocalDateTime since);

    @Modifying
    @Query("DELETE FROM UserNotification n WHERE n.id = :id")
    void deleteNotificationById(@Param("id") Long id);

    // Must run BEFORE token rows are deleted (FK: user_notifications.token_id → tokens.id)
    @Modifying
    @Query(value = "DELETE FROM user_notifications WHERE token_id IN " +
            "(SELECT id FROM tokens WHERE branch_id = :branchId)", nativeQuery = true)
    void deleteNotificationsByBranchIdNative(@Param("branchId") Long branchId);

    @Modifying
    @Query("DELETE FROM UserNotification n WHERE n.user.id = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM UserNotification n " +
            "WHERE n.user.id = :userId AND n.read = true AND n.createdAt < :before")
    void deleteOldReadNotifications(
            @Param("userId") Long userId,
            @Param("before") LocalDateTime before);
}
