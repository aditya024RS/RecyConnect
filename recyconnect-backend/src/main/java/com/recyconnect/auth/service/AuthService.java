package com.recyconnect.auth.service;

import com.recyconnect.auth.dto.JwtAuthResponse;
import com.recyconnect.auth.dto.LoginRequest;
import com.recyconnect.auth.dto.SignUpRequest;
import com.recyconnect.auth.model.Role;
import com.recyconnect.auth.model.User;
import com.recyconnect.auth.password.PasswordResetToken;
import com.recyconnect.auth.password.PasswordResetTokenRepository;
import com.recyconnect.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.recyconnect.auth.password.PasswordResetRequestDto;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

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

    @Transactional
    public void handleForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with email: " + email));

        // Create and save a new token
        PasswordResetToken token = new PasswordResetToken(user);
        tokenRepository.save(token);

        // Send the email
        emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
    }

    @Transactional
    public void resetPassword(PasswordResetRequestDto request) {
        // 1. Find the token in the database
        PasswordResetToken token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid password reset token."));

        // 2. Check if the token has expired
        if (token.getExpiryDate().before(new Date())) {
            tokenRepository.delete(token); // Clean up expired token
            throw new RuntimeException("Password reset token has expired.");
        }

        // 3. Get the user associated with the token
        User user = token.getUser();

        // 4. Set the new, encoded password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // 5. Delete the token so it cannot be used again
        tokenRepository.delete(token);
    }
}