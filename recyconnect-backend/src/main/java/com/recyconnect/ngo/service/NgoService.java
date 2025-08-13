package com.recyconnect.ngo.service;

import com.recyconnect.auth.model.Role;
import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.ngo.dto.NgoRegistrationRequestDto;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.model.NgoStatus;
import com.recyconnect.ngo.repository.NgoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NgoService {

    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void registerNgo(NgoRegistrationRequestDto request) {
        // 1. Create the User entity for the NGO
        User newUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_NGO) // Assign the NGO role
                .build();
        User savedUser = userRepository.save(newUser);

        // TODO: Integrate Geocoding API here to get lat/lng from address
        // For now, we'll use placeholder coordinates.
        double latitude = 22.5726; // Default to Kolkata
        double longitude = 88.3639;

        // 2. Create the associated Ngo entity
        Ngo newNgo = Ngo.builder()
                .user(savedUser)
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