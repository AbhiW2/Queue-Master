package com.example.Queue_Master.dto;

import com.example.Queue_Master.entity.UserNotification.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {

    private Long             id;
    private Long             tokenId;
    private String           displayToken;
    private NotificationType type;
    private String           title;
    private String           message;
    private boolean          read;
    private LocalDateTime    createdAt;
}