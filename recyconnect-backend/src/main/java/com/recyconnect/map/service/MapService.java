package com.recyconnect.map.service;

import com.recyconnect.map.dto.RecyclerDto;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.model.NgoStatus;
import com.recyconnect.ngo.repository.NgoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapService {

    private final NgoRepository ngoRepository;

    @Transactional(readOnly = true)
    public List<RecyclerDto> getActiveRecyclers(String wasteType, String query) {

        String searchQuery = (query == null || query.isBlank()) ? null : "%" + query.toLowerCase() + "%";

        List<Ngo> activeNgos = ngoRepository.findActiveNgosWithFilters(
                NgoStatus.ACTIVE,
                wasteType,
                searchQuery // Pass the prepared search query
        );

        return activeNgos.stream()
                .map(this::mapToRecyclerDto)
                .collect(Collectors.toList());
    }

    private RecyclerDto mapToRecyclerDto(Ngo ngo) {
        return RecyclerDto.builder()
                .id(ngo.getId())
                .name(ngo.getUser().getName())
                .latitude(ngo.getLatitude())
                .longitude(ngo.getLongitude())
                .wasteTypes(ngo.getAcceptedWasteTypes())
                .build();
    }
}