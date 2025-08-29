package com.recyconnect.stats.service;

import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.booking.model.BookingStatus;
import com.recyconnect.booking.repository.BookingRepository;
import com.recyconnect.ngo.model.NgoStatus;
import com.recyconnect.ngo.repository.NgoRepository;
import com.recyconnect.stats.dto.StatsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;
    private final BookingRepository bookingRepository;

    public StatsDto getSiteStats() {
        long users = userRepository.count();
        long ngos = ngoRepository.countByStatus(NgoStatus.ACTIVE);
        long bookings = bookingRepository.countByStatus(BookingStatus.COMPLETED);

        return StatsDto.builder()
                .totalUsers(users)
                .totalNgos(ngos)
                .pickupsCompleted(bookings)
                .build();
    }
}