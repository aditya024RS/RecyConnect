package com.recyconnect.stats.controller;

import com.recyconnect.stats.dto.LeaderboardDto;
import com.recyconnect.stats.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final GamificationService gamificationService;

    @GetMapping
    public ResponseEntity<List<LeaderboardDto>> getLeaderboard() {
        return ResponseEntity.ok(gamificationService.getLeaderboard());
    }
}