package com.recyconnect.ngo.service;

import com.recyconnect.ngo.dto.PendingNgoDto;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.model.NgoStatus;
import com.recyconnect.ngo.repository.NgoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NgoAdminService {

    private final NgoRepository ngoRepository;

    @Transactional(readOnly = true) // Use readOnly for fetch operations
    public List<PendingNgoDto> getPendingNgos() {
        List<Ngo> pendingNgos = ngoRepository.findByStatus(NgoStatus.PENDING_APPROVAL);
        // Convert the list of entities to a list of DTOs
        return pendingNgos.stream()
                .map(PendingNgoDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public Ngo approveNgo(Long ngoId) {
        Optional<Ngo> optionalNgo = ngoRepository.findById(ngoId);

        if (optionalNgo.isPresent()) {
            Ngo ngo = optionalNgo.get();
            ngo.setStatus(NgoStatus.ACTIVE);
            return ngoRepository.save(ngo);
        } else {
            throw new EntityNotFoundException("NGO with ID " + ngoId + " not found.");
        }
    }
}