package com.recyconnect.ngo.service;

import com.recyconnect.auth.model.User;
import com.recyconnect.auth.service.EmailService;
import com.recyconnect.ngo.dto.NgoApplicationRequestDto;
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
    private final EmailService emailService;

    @Transactional
    public void applyForNgoStatus(NgoApplicationRequestDto request, User currentUser) {

        // Create the associated Ngo entity and link it to the current user
        Ngo newNgo = Ngo.builder()
                .name(request.getName())
                .user(currentUser)
                .address(request.getAddress())
                .contactNumber(request.getContactNumber())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(NgoStatus.PENDING_APPROVAL) // Default status
                .acceptedWasteTypes(request.getAcceptedWasteTypes())
                .build();

        ngoRepository.save(newNgo);

        // Trigger the Admin Alert
        emailService.sendNgoApplicationAlert(
                newNgo.getName(),
                currentUser.getEmail(),
                newNgo.getAddress()
        );
    }
}