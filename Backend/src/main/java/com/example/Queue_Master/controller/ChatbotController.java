package com.example.Queue_Master.controller;

import com.example.Queue_Master.dto.ChatRequest;
import com.example.Queue_Master.dto.ChatResponse;
import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request,
            Authentication auth) {

        // Your JwtFilter already sets this — no extra work needed
        User user = (User) auth.getPrincipal();

        String reply = chatbotService.chat(request.message(), user.getId());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}