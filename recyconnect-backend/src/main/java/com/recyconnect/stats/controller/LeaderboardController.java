package com.recyconnect.stats.controller;

import com.recyconnect.auth.model.Role;
import com.recyconnect.stats.dto.LeaderboardDto;
import com.recyconnect.stats.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final GamificationService gamificationService;

    @GetMapping
    public ResponseEntity<List<LeaderboardDto>> getLeaderboard(@RequestParam(defaultValue = "USER") String type) {
        // Simple logic: If type is "NGO", fetch Top NGOs. Otherwise, fetch Top Users.
        Role role = "NGO".equalsIgnoreCase(type) ? Role.ROLE_NGO : Role.ROLE_USER;
        return ResponseEntity.ok(gamificationService.getLeaderboard(role));
    }
}