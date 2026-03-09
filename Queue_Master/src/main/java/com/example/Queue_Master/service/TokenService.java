package com.example.Queue_Master.service;

import com.example.Queue_Master.entity.Doctor;
import com.example.Queue_Master.entity.Token;
import com.example.Queue_Master.repository.DoctorRepository;
import com.example.Queue_Master.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class TokenService {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Transactional
    public Token bookToken(Long userId, Long doctorId, Long branchServiceId) {

        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Valid user ID is required");
        }

        if (branchServiceId == null || branchServiceId <= 0) {
            throw new IllegalArgumentException("Branch service ID is required");
        }

        LocalDate today = LocalDate.now();

        int lastToken = tokenRepository.findLastToken(branchServiceId, today);
        int nextToken = lastToken + 1;

        int waiting = tokenRepository.countServiceQueue(branchServiceId, today);

        int avgMinutes = 15;  // default for non-doctor services

        if (doctorId != null && doctorId > 0) {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new IllegalArgumentException("Doctor not found: " + doctorId));

            Integer doctorTime = doctor.getAvgConsultationTime();
            if (doctorTime != null && doctorTime > 0) {
                avgMinutes = doctorTime;
            }
        }

        int estimatedWait = waiting * avgMinutes;

        Token token = new Token();
        token.setTokenNumber(nextToken);
        token.setBookingDate(today);
        token.setStatus("BOOKED");
        token.setUserId(userId);
        token.setDoctorId(doctorId);
        token.setBranchServiceId(branchServiceId);
        token.setEstimatedWaitTime(estimatedWait);

        return tokenRepository.save(token);
    }
}

//
//package com.example.Queue_Master.service;
//
//import com.example.Queue_Master.entity.Doctor;
//import com.example.Queue_Master.entity.Token;
//import com.example.Queue_Master.repository.DoctorRepository;
//import com.example.Queue_Master.repository.TokenRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//
//@Service
//public class TokenService {
//
//    @Autowired
//    private TokenRepository tokenRepository;
//
//    @Autowired
//    private DoctorRepository doctorRepository;
//
//    @Transactional
//    public Token bookToken(Long userId, Long doctorId, Long branchServiceId) {
//
//        // Basic input validation
//        if (userId == null || userId <= 0) {
//            throw new IllegalArgumentException("Valid user ID is required");
//        }
//        if (branchServiceId == null || branchServiceId <= 0) {
//            throw new IllegalArgumentException("Service ID is required");
//        }
//
//        LocalDate today = LocalDate.now();
//
//        // Token number sequencing per service per day
//        int lastToken = tokenRepository.findLastToken(branchServiceId, today);
//        int nextToken = lastToken + 1;
//
//        // How many people are still waiting
//        int waiting = tokenRepository.countServiceQueue(branchServiceId, today);
//
//        // Default service time when no doctor is involved (bank, hotel, government, etc.)
//        int avgMinutes = 15;
//
//        // If doctor is provided → use doctor's consultation time
//        if (doctorId != null && doctorId > 0) {
//            Doctor doctor = doctorRepository.findById(doctorId)
//                    .orElseThrow(() -> new IllegalArgumentException("Doctor not found with id: " + doctorId));
//
//            Integer doctorTime = doctor.getAvgConsultationTime();
//            if (doctorTime != null && doctorTime > 0) {
//                avgMinutes = doctorTime;
//            }
//        }
//
//        int estimatedWaitMinutes = waiting * avgMinutes;
//
//        Token token = new Token();
//        token.setTokenNumber(nextToken);
//        token.setBookingDate(today);
//        token.setStatus("BOOKED");
//        token.setUserId(userId);
//        token.setDoctorId(doctorId);              // null is allowed
//        token.setBranchServiceId(branchServiceId);
//        token.setEstimatedWaitTime(estimatedWaitMinutes);
//
//        return tokenRepository.save(token);
//    }
//}