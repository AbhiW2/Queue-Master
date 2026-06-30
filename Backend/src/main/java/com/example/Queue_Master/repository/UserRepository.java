package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.Role;
import com.example.Queue_Master.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameOrEmail(String username, String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    // ── Super Admin needs ──────────────────────────────
    List<User> findByRole(Role role);
    List<User> findByRoleNot(Role role);
}