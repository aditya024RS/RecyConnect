package com.recyconnect.ngo.service;

import com.recyconnect.auth.model.User;
import com.recyconnect.ngo.dto.NgoApplicationRequestDto; // We will create this DTO
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.model.NgoStatus;
import com.recyconnect.ngo.repository.NgoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NgoService {

    private final NgoRepository ngoRepository;

    @Transactional
    public void applyForNgoStatus(NgoApplicationRequestDto request, User currentUser) {
        // TODO: Integrate Geocoding API here to get lat/lng from address
        // For now, we'll use placeholder coordinates from your area.
        double latitude = 22.2510; // Haldia
        double longitude = 88.0844;

        // Create the associated Ngo entity and link it to the current user
        Ngo newNgo = Ngo.builder()
                .name(request.getName())
                .user(currentUser)
                .address(request.getAddress())
                .contactNumber(request.getContactNumber())
                .latitude(latitude)
                .longitude(longitude)
                .status(NgoStatus.PENDING_APPROVAL) // Default status
                .acceptedWasteTypes(request.getAcceptedWasteTypes())
                .build();

        ngoRepository.save(newNgo);
    }
}