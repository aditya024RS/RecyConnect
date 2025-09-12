package com.recyconnect.ngo.service;

import com.recyconnect.auth.model.User;
import com.recyconnect.ngo.dto.NgoProfileDto;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.repository.NgoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NgoProfileService {

    private final NgoRepository ngoRepository;

    @Transactional(readOnly = true)
    public NgoProfileDto getNgoProfile(User currentUser) {
        Ngo ngo = ngoRepository.findByUser(currentUser)
                .orElseThrow(() -> new EntityNotFoundException("NGO profile not found for user: " + currentUser.getEmail()));
        return NgoProfileDto.fromEntity(ngo);
    }

    @Transactional
    public NgoProfileDto updateNgoProfile(User currentUser, NgoProfileDto updateRequest) {
        Ngo ngo = ngoRepository.findByUser(currentUser)
                .orElseThrow(() -> new EntityNotFoundException("NGO profile not found for user: " + currentUser.getEmail()));

        // Update the fields
        ngo.setName(updateRequest.getName());
        ngo.setAddress(updateRequest.getAddress());
        ngo.setContactNumber(updateRequest.getContactNumber());
        ngo.setAcceptedWasteTypes(updateRequest.getAcceptedWasteTypes());

        // TODO: Here you would re-run the geocoding if the address has changed

        Ngo updatedNgo = ngoRepository.save(ngo);
        return NgoProfileDto.fromEntity(updatedNgo);
    }
}