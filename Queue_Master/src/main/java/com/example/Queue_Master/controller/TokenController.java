package com.example.Queue_Master.controller;

import com.example.Queue_Master.dto.TokenRequest;
import com.example.Queue_Master.entity.Token;
import com.example.Queue_Master.service.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tokens")
@CrossOrigin(origins = "*")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookToken(@RequestBody TokenRequest request) {

        if (request.getUserId() == null || request.getUserId() <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "userId is required and must be positive"));
        }

        if (request.getBranchServiceId() == null || request.getBranchServiceId() <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "branchServiceId is required and must be positive"));
        }

        try {
            Token token = tokenService.bookToken(
                    request.getUserId(),
                    request.getDoctorId(),
                    request.getBranchServiceId()
            );
            return ResponseEntity.ok(token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal error", "message", e.getMessage()));
        }
    }
}
//
//package com.example.Queue_Master.controller;
//
//import com.example.Queue_Master.dto.TokenRequest;
//import com.example.Queue_Master.entity.Token;
//import com.example.Queue_Master.service.TokenService;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/tokens")
//@CrossOrigin(origins = "*")
//public class TokenController {
//
//    private final TokenService tokenService;
//
//    public TokenController(TokenService tokenService) {
//        this.tokenService = tokenService;
//    }
//
//    @PostMapping("/book")
//    public ResponseEntity<?> bookToken(@RequestBody TokenRequest request) {
//        try {
//            if (request.getUserId() == null) {
//                return ResponseEntity.badRequest().body(Map.of("error", "userId is required"));
//            }
//            if (request.getBranchServiceId() == null) {
//                return ResponseEntity.badRequest().body(Map.of("error", "branchServiceId is required"));
//            }
//
//            Token token = tokenService.bookToken(
//                    request.getUserId(),
//                    request.getDoctorId(),
//                    request.getBranchServiceId()
//            );
//
//            return ResponseEntity.ok(token);
//        } catch (IllegalArgumentException e) {
//            Map<String, String> error = new HashMap<>();
//            error.put("error", e.getMessage());
//            return ResponseEntity.badRequest().body(error);
//        } catch (Exception e) {
//            Map<String, String> error = new HashMap<>();
//            error.put("error", "Internal server error");
//            error.put("message", e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
//        }
//    }
//}