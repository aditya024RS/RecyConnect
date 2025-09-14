package com.recyconnect.auth.controller;

import com.recyconnect.auth.dto.UserDto;
import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.recyconnect.stats.service.GamificationService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        // Get the authentication object from Spring Security's context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        // Find the user in the database
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get the user's rank
        Long rank = gamificationService.getUserRank(user.getId());

        // Map the User entity to a UserDto
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