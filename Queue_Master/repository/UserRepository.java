
package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.Role;
import com.example.Queue_Master.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    // Used by AdminService + SuperAdminService
    List<User> findByRole(Role role);

    List<User> findByRoleNot(Role role);

    // Used by AdminService: get all STAFF assigned to a specific branch
    List<User> findByRoleAndBranchId(Role role, Long branchId);
}