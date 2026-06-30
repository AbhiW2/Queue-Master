package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {

    /** All notifications for a user, newest first */
    List<UserNotification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /** Count unread notifications for badge */
    long countByUserIdAndReadFalse(Long userId);

    /** Mark all of a user's notifications as read */
    @Modifying
    @Query("UPDATE UserNotification n SET n.read = true WHERE n.user.id = :userId AND n.read = false")
    void markAllReadByUserId(@Param("userId") Long userId);

    /** Delete all notifications for a user (clear-all) */
    void deleteByUserId(Long userId);
}