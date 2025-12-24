package com.recyconnect.stats.service;

import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.booking.model.BookingStatus;
import com.recyconnect.booking.repository.BookingRepository;
import com.recyconnect.ngo.model.NgoStatus;
import com.recyconnect.ngo.repository.NgoRepository;
import com.recyconnect.stats.dto.StatsDto;
import com.recyconnect.stats.model.SystemStats;
import com.recyconnect.stats.repository.SystemStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;
    private final BookingRepository bookingRepository;
    private final SystemStatsRepository systemStatsRepository; // Inject the new repo

    public StatsDto getSiteStats() {
        // 1. Fetch Real Data
        long realUsers = userRepository.count();
        long realNgos = ngoRepository.countByStatus(NgoStatus.ACTIVE);
        long realBookings = bookingRepository.countByStatus(BookingStatus.COMPLETED);

        // 2. Fetch Base Stats (Seeded Data)
        // We look for the first record, or default to 0s if something went wrong
        SystemStats baseStats = systemStatsRepository.findAll().stream()
                .findFirst()
                .orElse(SystemStats.builder()
                        .baseUsers(0)
                        .baseActiveNgos(0)
                        .baseTotalPickups(0)
                        .build());

        // 3. Calculate Totals (Real + Base)
        long totalUsers = realUsers + baseStats.getBaseUsers();
        long totalNgos = realNgos + baseStats.getBaseActiveNgos();
        long totalPickups = realBookings + baseStats.getBaseTotalPickups();

        return StatsDto.builder()
                .totalUsers(totalUsers)
                .totalNgos(totalNgos)
                .pickupsCompleted(totalPickups)
                .build();
    }
}