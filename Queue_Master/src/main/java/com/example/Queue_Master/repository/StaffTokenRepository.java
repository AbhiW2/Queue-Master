//package com.queuemaster.backend.repository;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import com.queuemaster.backend.model.Token;
//import java.util.Optional;
//
//public interface TokenRepository extends JpaRepository<Token, Long> {
//    Token findTopByOrderByTokenNumberDesc();
//    long countByStatus(String status);
//    Optional<Token> findFirstByStatusOrderByTokenNumberAsc(String status);
//    Optional<Token> findFirstByStatusOrderByUpdatedAtDesc(String status);
//}