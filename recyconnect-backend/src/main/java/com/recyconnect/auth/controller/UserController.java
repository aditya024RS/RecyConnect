package com.recyconnect.auth.controller;

import com.recyconnect.auth.dto.UserDto;
import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.stats.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        // 1. Get the ID from the SecurityContext (it's now a String number like "1")
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Fix: Find by ID, not Email
        User user = userRepository.findById(Integer.parseInt(currentUserId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long rank = gamificationService.getUserRank(user.getId());

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .ecoPoints(user.getEcoPoints())
                .rank(rank)
                .build();

        return ResponseEntity.ok(userDto);
    }
}