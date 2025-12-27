package com.recyconnect.notification.repository;

import com.recyconnect.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Fetch unread or recent notifications for a user
    List<Notification> findTop10ByUserIdOrderByCreatedAtDesc(Integer userId);

    long countByUserIdAndIsReadFalse(Integer userId);
}