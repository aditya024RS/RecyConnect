package com.recyconnect.ngo.service;

import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.model.NgoStatus;
import com.recyconnect.ngo.repository.NgoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NgoAdminService {

    private final NgoRepository ngoRepository;

    public List<Ngo> getPendingNgos() {
        return ngoRepository.findByStatus(NgoStatus.PENDING_APPROVAL);
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