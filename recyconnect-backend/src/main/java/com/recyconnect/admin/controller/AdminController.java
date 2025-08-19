package com.recyconnect.admin.controller;

import com.recyconnect.ngo.dto.PendingNgoDto;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.service.NgoAdminService;
import com.recyconnect.ngo.dto.NgoResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final NgoAdminService ngoAdminService;

    @GetMapping("/ngos/pending")
    public ResponseEntity<List<PendingNgoDto>> getPendingNgos() {
        List<PendingNgoDto> pendingNgos = ngoAdminService.getPendingNgos();
        return ResponseEntity.ok(pendingNgos);
    }

    @PostMapping("/ngos/{ngoId}/approve")
    public ResponseEntity<NgoResponseDto> approveNgo(@PathVariable Long ngoId) {
        NgoResponseDto approvedNgo = ngoAdminService.approveNgo(ngoId);
        return ResponseEntity.ok(approvedNgo);
    }
}