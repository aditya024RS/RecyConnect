package com.recyconnect.config;

import com.recyconnect.auth.model.Role;
import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.stats.model.SystemStats;
import com.recyconnect.stats.repository.SystemStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SystemStatsRepository statsRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedSystemStats();
        seedAdminUser();
    }

    private void seedSystemStats() {
        if (statsRepository.count() == 0) {
            SystemStats stats = SystemStats.builder()
                    .baseTotalPickups(48) // Start with 48 "fake" pickups
                    .baseActiveNgos(12)   // Start with 12 "fake" NGOs
                    .baseUsers(150)       // Start with 150 "fake" users
                    .build();
            statsRepository.save(stats);
            System.out.println("🌱 System Stats Seeded!");
        }
    }

    private void seedAdminUser() {
        if (userRepository.findByEmail("admin@recyconnect.com").isEmpty()) {
            User admin = User.builder()
                    .name("Super Admin")
                    .email("admin@recyconnect.com")
                    .password(passwordEncoder.encode("A@RC2468")) // Change this password!
                    .role(Role.ROLE_ADMIN)
                    .ecoPoints(0)
                    .build();
            userRepository.save(admin);
            System.out.println("🛡️ Admin User Seeded!");
        }
    }
}