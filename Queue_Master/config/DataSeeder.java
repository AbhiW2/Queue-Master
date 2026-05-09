package com.example.Queue_Master.config;

import com.example.Queue_Master.entity.Role;
import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    // Read from application.properties / environment variable.
    // Falls back to a default ONLY in local dev — never in production.
    @Value("${app.superadmin.email:superadmin@queuemaster.com}")
    private String superAdminEmail;

    @Value("${app.superadmin.username:superadmin}")
    private String superAdminUsername;

    @Value("${app.superadmin.password:SuperAdmin@123}")
    private String superAdminPassword;

    @Override
    public void run(ApplicationArguments args) {
        seedSuperAdmin();
    }

    private void seedSuperAdmin() {
        // If the super-admin already exists, do nothing — never overwrite.
        if (userRepository.findByEmail(superAdminEmail).isPresent()) {
            log.info("SUPER_ADMIN already exists — skipping seed.");
            return;
        }

        User superAdmin = new User();
        superAdmin.setUsername(superAdminUsername);
        superAdmin.setEmail(superAdminEmail);
        superAdmin.setPassword(passwordEncoder.encode(superAdminPassword));
        superAdmin.setRole(Role.SUPER_ADMIN);

        userRepository.save(superAdmin);
        log.info("SUPER_ADMIN seeded: {}", superAdminEmail);
    }
}