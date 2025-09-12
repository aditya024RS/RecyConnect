package com.recyconnect.ngo.controller;

import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.ngo.dto.NgoApplicationRequestDto;
import com.recyconnect.ngo.dto.NgoProfileDto;
import com.recyconnect.ngo.service.NgoProfileService;
import com.recyconnect.ngo.service.NgoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ngo")
@RequiredArgsConstructor
public class NgoController {

    private final NgoService ngoService;
    private final UserRepository userRepository;
    private final NgoProfileService ngoProfileService;

    @PostMapping("/apply")
    public ResponseEntity<String> applyForNgoStatus(@Valid @RequestBody NgoApplicationRequestDto request, Authentication authentication) {
        // Get the currently authenticated user
        User currentUser = (User) authentication.getPrincipal();

        // Pass the application details and the user to the service
        ngoService.applyForNgoStatus(request, currentUser);

        return ResponseEntity.ok("Your application to become a service provider has been submitted and is pending approval.");
    }

    @GetMapping("/profile")
    public ResponseEntity<NgoProfileDto> getNgoProfile(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ngoProfileService.getNgoProfile(currentUser));
    }

    @PutMapping("/profile")
    public ResponseEntity<NgoProfileDto> updateNgoProfile(@Valid @RequestBody NgoProfileDto request, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ngoProfileService.updateNgoProfile(currentUser, request));
    }
}