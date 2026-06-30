package com.example.Queue_Master.config;

import com.example.Queue_Master.entity.Role;
import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seedSuperAdmin();
    }

    private void seedSuperAdmin() {
        String email = "superadmin@queuemaster.com";

        userRepository.findByEmail(email).ifPresentOrElse(existing -> {
            // ✅ TEMP: Force reset password every time to fix stale hash
            existing.setPassword(passwordEncoder.encode("SuperAdmin@123"));
            userRepository.save(existing);
            log.info("SUPER_ADMIN password force-reset.");

        }, () -> {
            User superAdmin = new User();
            superAdmin.setUsername("superadmin");
            superAdmin.setEmail(email);
            superAdmin.setPassword(passwordEncoder.encode("SuperAdmin@123"));
            superAdmin.setRole(Role.SUPER_ADMIN);
            userRepository.save(superAdmin);
            log.info("SUPER_ADMIN seeded successfully.");
        });
    }
}