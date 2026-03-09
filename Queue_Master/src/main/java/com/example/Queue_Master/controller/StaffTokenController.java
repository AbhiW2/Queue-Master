//package com.example.Queue_Master.controller;
//
//import java.util.List;
//import java.util.Map;
//import org.springframework.web.bind.annotation.*;
//import lombok.RequiredArgsConstructor;
//import com.queuemaster.backend.service.TokenService;
//import com.queuemaster.backend.model.Token;
//import jakarta.validation.Valid;
//
//@RestController
//@RequestMapping("/api/tokens")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173")
//
//public class TokenController {
//
//    private final TokenService tokenService;
//
//    @PostMapping
//    public Token createToken(@Valid @RequestBody Token token) {
//        return tokenService.createToken(token);
//    }
//
//    @PostMapping("/next")
//    public Token processNextToken() {
//        return tokenService.processNextToken();
//    }
//
//    @GetMapping
//    public List<Token> getAll() {
//        return tokenService.getAllTokens();
//    }
//
//    @GetMapping("/stats")
//    public Map<String, Long> getStatistics() {
//        return tokenService.getStatistics();
//    }
//
//    @GetMapping("/current")
//    public Token getCurrentServingToken() {
//        return tokenService.getCurrentServingToken();
//    }
//
//    @PutMapping("/{id}/status")
//    public Token update(@PathVariable Long id,
//                        @RequestParam String status) {
//        return tokenService.updateStatus(id, status);
//    }
//
//    @DeleteMapping("/{id}")
//    public String delete(@PathVariable Long id) {
//        tokenService.deleteToken(id);
//        return "Token deleted successfully";
//    }
//}