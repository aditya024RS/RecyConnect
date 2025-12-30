package com.recyconnect.auth.config;

import com.recyconnect.auth.model.Role;
import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.auth.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Find or create the user
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseGet(() -> {
            User newUser = User.builder()
                    .name(name)
                    .email(email)
                    .role(Role.ROLE_USER)
                    .ecoPoints(0)
                    .build();
            return userRepository.save(newUser);
        });

        // Generate our own JWT
        String token = jwtService.generateToken(user);

        // Redirect back to the frontend with the JWT
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/login/oauth2/success")
                .queryParam("token", token)
                .queryParam("role", user.getRole().name())
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}