package com.recyconnect.stats.service;

import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.stats.dto.LeaderboardDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final UserRepository userRepository;

    public List<LeaderboardDto> getLeaderboard() {
        List<User> topUsers = userRepository.findTop10ByOrderByEcoPointsDesc();
        AtomicLong rank = new AtomicLong(1);

        return topUsers.stream()
                .map(user -> new LeaderboardDto(
                        rank.getAndIncrement(),
                        user.getName(),
                        user.getEcoPoints()
                ))
                .toList();
    }

    public Long getUserRank(Integer userId) {
        // Returns the rank or a default value if not found
        return userRepository.findRankByUserId(userId).orElse(0L);
    }
}