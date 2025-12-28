package com.recyconnect.map.service;

import com.recyconnect.booking.model.BookingStatus;
import com.recyconnect.booking.repository.BookingRepository;
import com.recyconnect.map.dto.RecyclerDto;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.model.NgoStatus;
import com.recyconnect.ngo.repository.NgoRepository;
import com.recyconnect.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapService {

    private final NgoRepository ngoRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public List<RecyclerDto> getActiveRecyclers(String wasteType, String query) {

        String searchQuery = (query == null || query.isBlank()) ? null : "%" + query.toLowerCase() + "%";

        List<Ngo> activeNgos = ngoRepository.findActiveNgosWithFilters(
                NgoStatus.ACTIVE,
                wasteType,
                searchQuery // Pass the prepared search query
        );

        return activeNgos.stream()
                .map(ngo -> {
                    // Fetch Stats for each NGO
                    int pickups = bookingRepository.countByNgoIdAndStatus(ngo.getId(), BookingStatus.COMPLETED);
                    Double rating = reviewRepository.getAverageRatingByNgoId(ngo.getId());

                    // Use updated builder
                    return RecyclerDto.fromEntity(ngo, rating, pickups);
                })
                .collect(Collectors.toList());
    }
}