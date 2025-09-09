package com.recyconnect.ngo.service;

import com.recyconnect.auth.model.Role;
import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.ngo.dto.PendingNgoDto;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.model.NgoStatus;
import com.recyconnect.ngo.dto.NgoResponseDto;
import com.recyconnect.ngo.repository.NgoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NgoAdminService {

    private final NgoRepository ngoRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true) // Use readOnly for fetch operations
    public List<PendingNgoDto> getPendingNgos() {
        List<Ngo> pendingNgos = ngoRepository.findByStatus(NgoStatus.PENDING_APPROVAL);
        // Convert the list of entities to a list of DTOs
        return pendingNgos.stream()
                .map(PendingNgoDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public NgoResponseDto approveNgo(Long ngoId) {
        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new EntityNotFoundException("NGO with ID " + ngoId + " not found."));

        ngo.setStatus(NgoStatus.ACTIVE);
        User user = ngo.getUser();
        user.setRole(Role.ROLE_NGO);
        userRepository.save(user);
        Ngo savedNgo = ngoRepository.save(ngo);

        return NgoResponseDto.fromEntity(savedNgo);
    }

}