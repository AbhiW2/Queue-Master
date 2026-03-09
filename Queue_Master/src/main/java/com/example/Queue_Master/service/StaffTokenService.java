//package com.queuemaster.backend.service;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.List;
//import org.springframework.stereotype.Service;
//import lombok.RequiredArgsConstructor;
//import com.queuemaster.backend.repository.TokenRepository;
//import com.queuemaster.backend.exception.NoWaitingTokenException;
//import com.queuemaster.backend.exception.TokenNotFoundException;
//import com.queuemaster.backend.model.Token;
//
//@Service
//@RequiredArgsConstructor
//public class TokenService {
//
//    private final TokenRepository tokenRepository;
//
//    public Token createToken(Token token) {
//
//        Token lastToken = tokenRepository.findTopByOrderByTokenNumberDesc();
//        int nextNumber = (lastToken == null) ? 1 : lastToken.getTokenNumber() + 1;
//
//        token.setTokenNumber(nextNumber);
//        return tokenRepository.save(token);
//    }
//
//    public List<Token> getAllTokens() {
//        return tokenRepository.findAll();
//    }
//
//    public Token updateStatus(Long id, String status) {
//        Token token = tokenRepository.findById(id)
//                .orElseThrow(() -> new TokenNotFoundException(id));
//
//        token.setStatus(status);
//        return tokenRepository.save(token);
//    }
//
//    public void deleteToken(Long id) {
//        tokenRepository.deleteById(id);
//    }
//
//    public Map<String, Long> getStatistics() {
//
//        long total = tokenRepository.count();
//        long waiting = tokenRepository.countByStatus("WAITING");
//        long completed = tokenRepository.countByStatus("COMPLETED");
//
//        Map<String, Long> stats = new HashMap<>();
//        stats.put("totalTokens", total);
//        stats.put("waitingTokens", waiting);
//        stats.put("completedTokens", completed);
//
//        return stats;
//    }
//
//    public Token processNextToken() {
//
//        Token nextToken = tokenRepository
//                .findFirstByStatusOrderByTokenNumberAsc("WAITING")
//                .orElseThrow(NoWaitingTokenException::new);
//
//        nextToken.setStatus("COMPLETED");
//
//        return tokenRepository.save(nextToken);
//    }
//
//    public Token getCurrentServingToken() {
//
//        return tokenRepository
//                .findFirstByStatusOrderByUpdatedAtDesc("COMPLETED")
//                .orElseThrow(() -> new RuntimeException("No token has been served yet"));
//    }
//}