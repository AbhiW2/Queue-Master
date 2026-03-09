/*
package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Long> {

    // Count today's tokens for doctor
    @Query("SELECT COUNT(t) FROM Token t WHERE t.doctorId = :doctorId AND t.bookingDate = :date")
    long countTodayDoctorTokens(@Param("doctorId") Long doctorId,
                                @Param("date") LocalDate date);

    // Get queue tokens ordered
    List<Token> findByDoctorIdOrderByTokenNumb
*/


//package com.example.Queue_Master.repository;
//
//import com.example.Queue_Master.entity.Token;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.time.LocalDate;
//import java.util.List;
//
//public interface TokenRepository extends JpaRepository<Token, Long> {
//
//    List<Token> findByDoctorIdOrderByTokenNumberAsc(Long doctorId);
//
//    List<Token> findByUserId(Long userId);
//
//    @Query("SELECT COUNT(t) FROM Token t WHERE t.doctorId = :doctorId AND t.bookingDate = :date")
//    long countTodayDoctorTokens(@Param("doctorId") Long doctorId,
//                                @Param("date") LocalDate date);
//}


//
//package com.example.Queue_Master.repository;
//
//import com.example.Queue_Master.entity.Token;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.time.LocalDate;
//
//public interface TokenRepository extends JpaRepository<Token, Long> {
//
//    @Query("""
//        SELECT COALESCE(MAX(t.tokenNumber),0)
//        FROM Token t
//        WHERE t.branchServiceId = :serviceId
//        AND t.bookingDate = :date
//    """)
//    int findLastToken(
//            @Param("serviceId") Long serviceId,
//            @Param("date") LocalDate date
//    );
//
//    @Query("""
//        SELECT COUNT(t)
//        FROM Token t
//        WHERE t.branchServiceId = :serviceId
//        AND t.bookingDate = :date
//        AND t.status = 'BOOKED'
//    """)
//    int countServiceQueue(
//            @Param("serviceId") Long serviceId,
//            @Param("date") LocalDate date
//    );
//}


//
//package com.example.Queue_Master.repository;
//
//import com.example.Queue_Master.entity.Token;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.time.LocalDate;
//import java.util.List;
//
//public interface TokenRepository extends JpaRepository<Token, Long> {
//
//    // Find last token number for a service today
//    @Query("""
//        SELECT COALESCE(MAX(t.tokenNumber),0)
//        FROM Token t
//        WHERE t.branchServiceId = :serviceId
//        AND t.bookingDate = :date
//    """)
//    int findLastToken(
//            @Param("serviceId") Long serviceId,
//            @Param("date") LocalDate date
//    );
//
//    // Count how many people waiting in queue
//    @Query("""
//        SELECT COUNT(t)
//        FROM Token t
//        WHERE t.branchServiceId = :serviceId
//        AND t.bookingDate = :date
//        AND t.status = 'BOOKED'
//    """)
//    int countServiceQueue(
//            @Param("serviceId") Long serviceId,
//            @Param("date") LocalDate date
//    );
//
//    // Get doctor queue
//    List<Token> findByDoctorIdOrderByTokenNumberAsc(Long doctorId);
//
//}




package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query("""
        SELECT COALESCE(MAX(t.tokenNumber),0)
        FROM Token t
        WHERE t.branchServiceId = :serviceId
        AND t.bookingDate = :date
    """)
    int findLastToken(
            @Param("serviceId") Long serviceId,
            @Param("date") LocalDate date
    );

    @Query("""
        SELECT COUNT(t)
        FROM Token t
        WHERE t.branchServiceId = :serviceId
        AND t.bookingDate = :date
        AND t.status = 'BOOKED'
    """)
    int countServiceQueue(
            @Param("serviceId") Long serviceId,
            @Param("date") LocalDate date
    );

    List<Token> findByDoctorIdOrderByTokenNumberAsc(Long doctorId);
}