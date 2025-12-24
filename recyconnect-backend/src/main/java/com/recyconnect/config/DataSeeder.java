package com.recyconnect.config;

import com.recyconnect.auth.model.Role;
import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.model.NgoStatus;
import com.recyconnect.ngo.repository.NgoRepository;
import com.recyconnect.stats.model.SystemStats;
import com.recyconnect.stats.repository.SystemStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SystemStatsRepository statsRepository;
    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedSystemStats();
        seedAdminUser();
        seedTestNgo();
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

    // Seeds a Test NGO in Kolkata
    private void seedTestNgo() {
        String ngoEmail = "testngo@recyconnect.com";

        if (userRepository.findByEmail(ngoEmail).isEmpty()) {
            // 1. Create the User account first
            User ngoUser = User.builder()
                    .name("Green Kolkata Foundation")
                    .email(ngoEmail)
                    .password(passwordEncoder.encode("Ngo@123"))
                    .role(Role.ROLE_NGO)
                    .ecoPoints(0)
                    .build();

            userRepository.save(ngoUser);

            // 2. Create the NGO Profile linked to this user
            Ngo testNgo = Ngo.builder()
                    .name("Green Kolkata Foundation")
                    .user(ngoUser)
                    .address("Park Street, Kolkata, West Bengal")
                    .contactNumber("9876543210")
                    // Default Kolkata Coordinates
                    .latitude(22.5726)
                    .longitude(88.3639)
                    .status(NgoStatus.ACTIVE) // Auto-approved!
                    .acceptedWasteTypes(List.of("Plastic", "Paper", "E-Waste"))
                    .build();

            ngoRepository.save(testNgo);
            System.out.println("🏢 Test NGO (Kolkata) Seeded!");
        }
    }
}