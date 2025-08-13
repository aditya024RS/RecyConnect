package com.recyconnect.admin.controller;

import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.service.NgoAdminService;
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
    public ResponseEntity<List<Ngo>> getPendingNgos() {
        List<Ngo> pendingNgos = ngoAdminService.getPendingNgos();
        return ResponseEntity.ok(pendingNgos);
    }

    @PostMapping("/ngos/{ngoId}/approve")
    public ResponseEntity<Ngo> approveNgo(@PathVariable Long ngoId) {
        Ngo approvedNgo = ngoAdminService.approveNgo(ngoId);
        return ResponseEntity.ok(approvedNgo);
    }
}