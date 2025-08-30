package com.recyconnect.auth.controller;

import com.recyconnect.auth.dto.JwtAuthResponse;
import com.recyconnect.auth.dto.LoginRequest;
import com.recyconnect.auth.dto.SignUpRequest;
import com.recyconnect.auth.service.AuthService;
import com.recyconnect.ngo.dto.NgoRegistrationRequestDto;
import com.recyconnect.ngo.service.NgoService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import com.recyconnect.auth.password.PasswordResetRequestDto;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final NgoService ngoService;

    @PostMapping("/register")
    public ResponseEntity<JwtAuthResponse> signup(@Valid @RequestBody SignUpRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register-ngo")
    public ResponseEntity<String> registerNgo(@Valid @RequestBody NgoRegistrationRequestDto request) {
        ngoService.registerNgo(request);
        return ResponseEntity.ok("NGO registration successful! Your application is pending approval.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            authService.handleForgotPassword(email);
            return ResponseEntity.ok("A password reset link has been sent to your email address.");
        } catch (UsernameNotFoundException e) {
            // Return a generic success message even if the user is not found
            // This prevents attackers from checking if an email is registered.
            return ResponseEntity.ok("If an account with that email exists, a reset link has been sent.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody PasswordResetRequestDto request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok("Your password has been reset successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}