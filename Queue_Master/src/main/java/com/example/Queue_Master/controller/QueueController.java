package com.example.Queue_Master.controller;

import com.example.Queue_Master.entity.Token;
import com.example.Queue_Master.repository.TokenRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin
public class QueueController {

    private final TokenRepository tokenRepository;

    public QueueController(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // Get all tokens for a doctor queue
    @GetMapping("/{doctorId}")
    public List<Token> getQueue(@PathVariable Long doctorId) {
        return tokenRepository.findByDoctorIdOrderByTokenNumberAsc(doctorId);
    }
}