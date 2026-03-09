package com.example.Queue_Master.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Queue_Master.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
}