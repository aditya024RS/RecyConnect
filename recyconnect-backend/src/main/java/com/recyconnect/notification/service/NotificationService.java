package com.recyconnect.notification.service;

import com.recyconnect.auth.model.User;
import com.recyconnect.notification.dto.NotificationResponseDto;
import com.recyconnect.notification.model.Notification;
import com.recyconnect.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void sendNotification(User user, String message) {
        // 1. Save to Database
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        Notification savedNotification = notificationRepository.save(notification);

        // 2. Convert to DTO (So it has the ID!)
        NotificationResponseDto dto = NotificationResponseDto.fromEntity(savedNotification);

        // 3. Send DTO via WebSocket (Real-time)
        String destination = "/queue/notifications/" + user.getId();
        messagingTemplate.convertAndSend(destination, dto);
    }

    public List<NotificationResponseDto> getUserNotifications(User user) {
        List<Notification> notifications = notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(user.getId());
        return notifications.stream()
                .map(NotificationResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}