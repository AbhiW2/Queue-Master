package com.example.Queue_Master.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.entity.Role;
import com.example.Queue_Master.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // REGISTER
    public String register(User user) {

        if (userRepository.findByEmail(user.getEmail()) != null) {
            return "Email already exists!";
        }

        user.setRole(Role.USER); // Default Role
        userRepository.save(user);

        return "User registered successfully!";
    }

    // LOGIN
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return null;
        }

        if (!user.getPassword().equals(password)) {
            return null;
        }

        return user;
    }
}