package com.recyconnect.auth.service;

import com.recyconnect.auth.dto.JwtAuthResponse;
import com.recyconnect.auth.dto.LoginRequest;
import com.recyconnect.auth.dto.SignUpRequest;
import com.recyconnect.auth.model.Role;
import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public JwtAuthResponse signup(SignUpRequest request) {
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER) // Default role
                .ecoPoints(0)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return JwtAuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .build();
    }

    public JwtAuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        var jwtToken = jwtService.generateToken(user);
        return JwtAuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .build();
    }
}