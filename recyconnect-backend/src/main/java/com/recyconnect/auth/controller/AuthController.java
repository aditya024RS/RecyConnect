package com.recyconnect.auth.controller;

import com.recyconnect.auth.dto.JwtAuthResponse;
import com.recyconnect.auth.dto.LoginRequest;
import com.recyconnect.auth.dto.SignUpRequest;
import com.recyconnect.auth.service.AuthService;
import com.recyconnect.ngo.dto.NgoRegistrationRequestDto;
import com.recyconnect.ngo.service.NgoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final NgoService ngoService;

    @PostMapping("/register")
    public ResponseEntity<JwtAuthResponse> signup(@RequestBody SignUpRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register-ngo")
    public ResponseEntity<String> registerNgo(@RequestBody NgoRegistrationRequestDto request) {
        ngoService.registerNgo(request);
        return ResponseEntity.ok("NGO registration successful! Your application is pending approval.");
    }
}