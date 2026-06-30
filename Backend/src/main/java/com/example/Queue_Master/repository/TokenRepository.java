//package com.example.Queue_Master.repository;
//
//import com.example.Queue_Master.entity.Token;
//import jakarta.persistence.LockModeType;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Lock;
//import org.springframework.data.jpa.repository.Modifying;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface TokenRepository extends JpaRepository<Token, Long> {
//
//    // =========================================================================
//    // QUEUE LOCK — Step 1 of atomic booking
//    // =========================================================================
//
//    @Lock(LockModeType.PESSIMISTIC_WRITE)
//    @Query("SELECT t FROM Token t " +
//            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
//            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
//    List<Token> lockDoctorQueueForDate(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date);
//
//    @Lock(LockModeType.PESSIMISTIC_WRITE)
//    @Query("SELECT t FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
//            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
//    List<Token> lockBranchServiceQueueForDate(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date);
//
//    // =========================================================================
//    // SHIFT-BASED — count tokens per shift per day
//    // =========================================================================
//
//    @Query("SELECT COUNT(t) FROM Token t " +
//            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
//            "  AND t.shiftType = :shift " +
//            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
//    int countTokensForDoctorShift(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date,
//            @Param("shift") Token.ShiftType shift);
//
//    @Query("SELECT COUNT(t) FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
//            "  AND t.shiftType = :shift " +
//            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
//    int countTokensForBranchServiceShift(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date,
//            @Param("shift") Token.ShiftType shift);
//
//    @Query("SELECT COUNT(t) > 0 FROM Token t " +
//            "WHERE t.user.id = :userId " +
//            "  AND t.doctor.id = :doctorId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.shiftType = :shift " +
//            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
//    boolean existsActiveTokenForUserDoctorShift(
//            @Param("userId") Long userId,
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date,
//            @Param("shift") Token.ShiftType shift);
//
//    @Query("SELECT COUNT(t) > 0 FROM Token t " +
//            "WHERE t.user.id = :userId " +
//            "  AND t.branchService.id = :branchServiceId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.shiftType = :shift " +
//            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
//    boolean existsActiveTokenForUserBranchServiceShift(
//            @Param("userId") Long userId,
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date,
//            @Param("shift") Token.ShiftType shift);
//
//    @Query("SELECT COUNT(t) FROM Token t " +
//            "WHERE t.doctor.id = :doctorId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.shiftType = :shift " +
//            "  AND t.tokenNumber < :tokenNumber " +
//            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
//    int countActiveTokensAheadForDoctorShift(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date,
//            @Param("shift") Token.ShiftType shift,
//            @Param("tokenNumber") Integer tokenNumber);
//
//    @Query("SELECT COUNT(t) FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.shiftType = :shift " +
//            "  AND t.tokenNumber < :tokenNumber " +
//            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
//    int countActiveTokensAheadForBranchServiceShift(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date,
//            @Param("shift") Token.ShiftType shift,
//            @Param("tokenNumber") Integer tokenNumber);
//
//    @Query("SELECT MAX(t.tokenNumber) FROM Token t " +
//            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
//            "  AND t.shiftType = :shift")
//    Optional<Integer> findMaxTokenNumberByDoctorDateShift(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date,
//            @Param("shift") Token.ShiftType shift);
//
//    @Query("SELECT MAX(t.tokenNumber) FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
//            "  AND t.shiftType = :shift")
//    Optional<Integer> findMaxTokenNumberByBranchServiceDateShift(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date,
//            @Param("shift") Token.ShiftType shift);
//
//    @Query("SELECT t FROM Token t " +
//            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
//            "  AND t.shiftType = :shift AND t.tokenNumber > :cancelledTokenNumber " +
//            "  AND t.status = 'BOOKED' ORDER BY t.tokenNumber ASC")
//    List<Token> findBookedTokensAfterForDoctorShift(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date,
//            @Param("shift") Token.ShiftType shift,
//            @Param("cancelledTokenNumber") Integer cancelledTokenNumber);
//
//    @Query("SELECT t FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
//            "  AND t.shiftType = :shift AND t.tokenNumber > :cancelledTokenNumber " +
//            "  AND t.status = 'BOOKED' ORDER BY t.tokenNumber ASC")
//    List<Token> findBookedTokensAfterForBranchServiceShift(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date,
//            @Param("shift") Token.ShiftType shift,
//            @Param("cancelledTokenNumber") Integer cancelledTokenNumber);
//
//    // =========================================================================
//    // SLOT COLLISION CHECK
//    // =========================================================================
//
//    @Query(value =
//            "SELECT COUNT(*) FROM tokens " +
//                    "WHERE doctor_id = :doctorId " +
//                    "  AND booking_date = :date " +
//                    "  AND scheduled_time = :scheduledTime " +
//                    "  AND status NOT IN ('CANCELLED','COMPLETED','NO_SHOW') " +
//                    "FOR UPDATE",
//            nativeQuery = true)
//    int countAndLockDoctorSlot(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date,
//            @Param("scheduledTime") LocalTime scheduledTime);
//
//    @Query(value =
//            "SELECT COUNT(*) FROM tokens " +
//                    "WHERE branch_service_id = :branchServiceId " +
//                    "  AND booking_date = :date " +
//                    "  AND scheduled_time = :scheduledTime " +
//                    "  AND status NOT IN ('CANCELLED','COMPLETED','NO_SHOW') " +
//                    "FOR UPDATE",
//            nativeQuery = true)
//    int countAndLockBranchServiceSlot(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date,
//            @Param("scheduledTime") LocalTime scheduledTime);
//
//    // =========================================================================
//    // MAX TOKEN NUMBER (legacy / global per day)
//    // =========================================================================
//
//    @Query("SELECT MAX(t.tokenNumber) FROM Token t " +
//            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date")
//    Optional<Integer> findMaxTokenNumberByDoctorAndDate(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date);
//
//    @Query("SELECT MAX(t.tokenNumber) FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date")
//    Optional<Integer> findMaxTokenNumberByBranchServiceAndDate(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date);
//
//    // =========================================================================
//    // TOKENS AHEAD — global fallback (no shift filter)
//    // =========================================================================
//
//    @Query("SELECT COUNT(t) FROM Token t " +
//            "WHERE t.doctor.id = :doctorId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.tokenNumber < :tokenNumber " +
//            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
//    int countActiveTokensAheadForDoctor(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date,
//            @Param("tokenNumber") Integer tokenNumber);
//
//    @Query("SELECT COUNT(t) FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.tokenNumber < :tokenNumber " +
//            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
//    int countActiveTokensAheadForBranchService(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date,
//            @Param("tokenNumber") Integer tokenNumber);
//
//    @Query("SELECT COUNT(t) FROM Token t " +
//            "WHERE t.doctor.id = :doctorId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
//    int countAllActiveTokensForDoctor(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date);
//
//    @Query("SELECT COUNT(t) FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
//    int countAllActiveTokensForBranchService(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date);
//
//    // =========================================================================
//    // DUPLICATE BOOKING GUARD (legacy — global per day)
//    // =========================================================================
//
//    @Query("SELECT COUNT(t) > 0 FROM Token t " +
//            "WHERE t.user.id = :userId " +
//            "  AND t.doctor.id = :doctorId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
//    boolean existsActiveTokenForUserAndDoctor(
//            @Param("userId") Long userId,
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date);
//
//    @Query("SELECT COUNT(t) > 0 FROM Token t " +
//            "WHERE t.user.id = :userId " +
//            "  AND t.branchService.id = :branchServiceId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
//    boolean existsActiveTokenForUserAndBranchService(
//            @Param("userId") Long userId,
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date);
//
//    // =========================================================================
//    // CANCEL — null out slot fields
//    // =========================================================================
//
//    @Modifying
//    @Query("UPDATE Token t SET t.scheduledTime = NULL, t.slotEndTime = NULL WHERE t.id = :tokenId")
//    void clearScheduledTime(@Param("tokenId") Long tokenId);
//
//    // =========================================================================
//    // POST-CANCELLATION RECALCULATION (legacy fallback — no shift filter)
//    // =========================================================================
//
//    @Query("SELECT t FROM Token t " +
//            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
//            "  AND t.tokenNumber > :cancelledTokenNumber AND t.status = 'BOOKED' " +
//            "ORDER BY t.tokenNumber ASC")
//    List<Token> findBookedTokensAfterForDoctor(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date,
//            @Param("cancelledTokenNumber") Integer cancelledTokenNumber);
//
//    @Query("SELECT t FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
//            "  AND t.tokenNumber > :cancelledTokenNumber AND t.status = 'BOOKED' " +
//            "ORDER BY t.tokenNumber ASC")
//    List<Token> findBookedTokensAfterForBranchService(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date,
//            @Param("cancelledTokenNumber") Integer cancelledTokenNumber);
//
//    // =========================================================================
//    // QUEUE LISTINGS
//    // =========================================================================
//
//    @Query("SELECT t FROM Token t JOIN FETCH t.user " +
//            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
//            "ORDER BY t.tokenNumber ASC")
//    List<Token> findDoctorQueueForDate(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date);
//
//    @Query("SELECT t FROM Token t JOIN FETCH t.user " +
//            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
//            "ORDER BY t.tokenNumber ASC")
//    List<Token> findBranchServiceQueueForDate(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date);
//
//    // =========================================================================
//    // CURRENTLY SERVING / NEXT
//    // =========================================================================
//
//    @Query("SELECT t FROM Token t " +
//            "WHERE t.doctor.id = :doctorId " +
//            "  AND t.bookingDate = :date AND t.status = 'IN_PROGRESS'")
//    Optional<Token> findCurrentlyServingForDoctor(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date);
//
//    @Query("SELECT t FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId " +
//            "  AND t.bookingDate = :date AND t.status = 'IN_PROGRESS'")
//    Optional<Token> findCurrentlyServingForBranchService(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date);
//
//    @Query("SELECT t FROM Token t " +
//            "WHERE t.doctor.id = :doctorId " +
//            "  AND t.bookingDate = :date AND t.status = 'BOOKED' " +
//            "ORDER BY t.tokenNumber ASC LIMIT 1")
//    Optional<Token> findNextTokenForDoctor(
//            @Param("doctorId") Long doctorId,
//            @Param("date") LocalDate date);
//
//    @Query("SELECT t FROM Token t " +
//            "WHERE t.branchService.id = :branchServiceId " +
//            "  AND t.bookingDate = :date AND t.status = 'BOOKED' " +
//            "ORDER BY t.tokenNumber ASC LIMIT 1")
//    Optional<Token> findNextTokenForBranchService(
//            @Param("branchServiceId") Long branchServiceId,
//            @Param("date") LocalDate date);
//
//    // =========================================================================
//    // USER HISTORY
//    // =========================================================================
//
//    @Query("SELECT t FROM Token t " +
//            "LEFT JOIN FETCH t.doctor LEFT JOIN FETCH t.branchService LEFT JOIN FETCH t.branch " +
//            "WHERE t.user.id = :userId AND t.deletedByUser = false " +
//            "ORDER BY t.bookingDate DESC, t.createdAt DESC")
//    List<Token> findAllByUserId(@Param("userId") Long userId);
//
//    @Query("SELECT t FROM Token t " +
//            "LEFT JOIN FETCH t.doctor LEFT JOIN FETCH t.branchService LEFT JOIN FETCH t.branch " +
//            "WHERE t.user.id = :userId " +
//            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS') " +
//            "  AND t.bookingDate >= :today " +
//            "ORDER BY t.bookingDate ASC, t.tokenNumber ASC")
//    List<Token> findActiveTokensByUserId(
//            @Param("userId") Long userId,
//            @Param("today") LocalDate today);
//
//    @Query("SELECT t FROM Token t " +
//            "JOIN FETCH t.user JOIN FETCH t.branch " +
//            "LEFT JOIN FETCH t.doctor LEFT JOIN FETCH t.branchService " +
//            "WHERE t.id = :tokenId")
//    Optional<Token> findByIdWithDetails(@Param("tokenId") Long tokenId);
//
//    // =========================================================================
//    // ACTIVE TOKENS WITH SCHEDULED TIME — 1-hour cooldown check
//    // =========================================================================
//
//    @Query("SELECT t FROM Token t " +
//            "LEFT JOIN FETCH t.doctor " +
//            "LEFT JOIN FETCH t.branchService " +
//            "WHERE t.user.id = :userId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.scheduledTime IS NOT NULL " +
//            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
//    List<Token> findActiveTokensWithScheduledTimeForUserOnDate(
//            @Param("userId") Long userId,
//            @Param("date") LocalDate date);
//
//    @Query("SELECT t FROM Token t " +
//            "LEFT JOIN FETCH t.doctor " +
//            "LEFT JOIN FETCH t.branchService " +
//            "WHERE t.user.id = :userId " +
//            "  AND t.bookingDate = :date " +
//            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
//    List<Token> findActiveTokensForUserOnDate(
//            @Param("userId") Long userId,
//            @Param("date") LocalDate date);
//
//    // =========================================================================
//    // BRANCH QUERIES
//    // =========================================================================
//
//    // ✅ FIXED: renamed from findByBranchId → findByBranch_Id
//    //    AdminService and SuperAdminService both call findByBranch_Id(branchId)
//    @Query("SELECT t FROM Token t WHERE t.branch.id = :branchId")
//    List<Token> findByBranch_Id(@Param("branchId") Long branchId);
//
//    // =========================================================================
//    // BRANCH DELETION — native queries
//    // =========================================================================
//
//    @Query("SELECT COUNT(t) FROM Token t " +
//            "WHERE t.branch.id = :branchId " +
//            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
//    long countActiveTokensByBranchId(@Param("branchId") Long branchId);
//
//    @Modifying
//    @Query(value = "DELETE FROM tokens WHERE branch_id = :branchId", nativeQuery = true)
//    void deleteAllTokensByBranchIdNative(@Param("branchId") Long branchId);
//
//    @Modifying
//    @Query(value = "DELETE FROM tokens WHERE doctor_id IN " +
//            "(SELECT id FROM doctors WHERE branch_id = :branchId)", nativeQuery = true)
//    void deleteAllTokensByDoctorBranchIdNative(@Param("branchId") Long branchId);
//
//    @Modifying
//    @Query(value = "DELETE FROM tokens WHERE branch_service_id IN " +
//            "(SELECT id FROM branch_services WHERE branch_id = :branchId)", nativeQuery = true)
//    void deleteAllTokensByBranchServiceBranchIdNative(@Param("branchId") Long branchId);
//}



















package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.Token;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    // =========================================================================
    // QUEUE LOCK — Step 1 of atomic booking
    // =========================================================================

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM Token t " +
            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    List<Token> lockDoctorQueueForDate(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    List<Token> lockBranchServiceQueueForDate(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    // =========================================================================
    // SHIFT-BASED — count tokens per shift per day
    // =========================================================================

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
            "  AND t.shiftType = :shift " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    int countTokensForDoctorShift(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift);

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
            "  AND t.shiftType = :shift " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    int countTokensForBranchServiceShift(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift);

    @Query("SELECT COUNT(t) > 0 FROM Token t " +
            "WHERE t.user.id = :userId " +
            "  AND t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date " +
            "  AND t.shiftType = :shift " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    boolean existsActiveTokenForUserDoctorShift(
            @Param("userId") Long userId,
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift);

    @Query("SELECT COUNT(t) > 0 FROM Token t " +
            "WHERE t.user.id = :userId " +
            "  AND t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date " +
            "  AND t.shiftType = :shift " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    boolean existsActiveTokenForUserBranchServiceShift(
            @Param("userId") Long userId,
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift);

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date " +
            "  AND t.shiftType = :shift " +
            "  AND t.tokenNumber < :tokenNumber " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
    int countActiveTokensAheadForDoctorShift(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift,
            @Param("tokenNumber") Integer tokenNumber);

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date " +
            "  AND t.shiftType = :shift " +
            "  AND t.tokenNumber < :tokenNumber " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
    int countActiveTokensAheadForBranchServiceShift(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift,
            @Param("tokenNumber") Integer tokenNumber);

    @Query("SELECT MAX(t.tokenNumber) FROM Token t " +
            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
            "  AND t.shiftType = :shift")
    Optional<Integer> findMaxTokenNumberByDoctorDateShift(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift);

    @Query("SELECT MAX(t.tokenNumber) FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
            "  AND t.shiftType = :shift")
    Optional<Integer> findMaxTokenNumberByBranchServiceDateShift(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift);

    @Query("SELECT t FROM Token t JOIN FETCH t.user " +
            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
            "  AND t.shiftType = :shift AND t.tokenNumber > :cancelledTokenNumber " +
            "  AND t.status = 'BOOKED' ORDER BY t.tokenNumber ASC")
    List<Token> findBookedTokensAfterForDoctorShift(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift,
            @Param("cancelledTokenNumber") Integer cancelledTokenNumber);

    @Query("SELECT t FROM Token t JOIN FETCH t.user " +
            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
            "  AND t.shiftType = :shift AND t.tokenNumber > :cancelledTokenNumber " +
            "  AND t.status = 'BOOKED' ORDER BY t.tokenNumber ASC")
    List<Token> findBookedTokensAfterForBranchServiceShift(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift,
            @Param("cancelledTokenNumber") Integer cancelledTokenNumber);

    // =========================================================================
    // SLOT COLLISION CHECK
    // =========================================================================

    @Query(value =
            "SELECT COUNT(*) FROM tokens " +
                    "WHERE doctor_id = :doctorId " +
                    "  AND booking_date = :date " +
                    "  AND scheduled_time = :scheduledTime " +
                    "  AND status NOT IN ('CANCELLED','COMPLETED','NO_SHOW') " +
                    "FOR UPDATE",
            nativeQuery = true)
    int countAndLockDoctorSlot(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("scheduledTime") LocalTime scheduledTime);

    @Query(value =
            "SELECT COUNT(*) FROM tokens " +
                    "WHERE branch_service_id = :branchServiceId " +
                    "  AND booking_date = :date " +
                    "  AND scheduled_time = :scheduledTime " +
                    "  AND status NOT IN ('CANCELLED','COMPLETED','NO_SHOW') " +
                    "FOR UPDATE",
            nativeQuery = true)
    int countAndLockBranchServiceSlot(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date,
            @Param("scheduledTime") LocalTime scheduledTime);

    // =========================================================================
    // MAX TOKEN NUMBER (legacy / global per day)
    // =========================================================================

    @Query("SELECT MAX(t.tokenNumber) FROM Token t " +
            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date")
    Optional<Integer> findMaxTokenNumberByDoctorAndDate(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Query("SELECT MAX(t.tokenNumber) FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date")
    Optional<Integer> findMaxTokenNumberByBranchServiceAndDate(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    // =========================================================================
    // TOKENS AHEAD — global fallback (no shift filter)
    // =========================================================================

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date " +
            "  AND t.tokenNumber < :tokenNumber " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
    int countActiveTokensAheadForDoctor(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("tokenNumber") Integer tokenNumber);

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date " +
            "  AND t.tokenNumber < :tokenNumber " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
    int countActiveTokensAheadForBranchService(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date,
            @Param("tokenNumber") Integer tokenNumber);

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
    int countAllActiveTokensForDoctor(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
    int countAllActiveTokensForBranchService(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    // =========================================================================
    // DUPLICATE BOOKING GUARD (legacy — global per day)
    // =========================================================================

    @Query("SELECT COUNT(t) > 0 FROM Token t " +
            "WHERE t.user.id = :userId " +
            "  AND t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    boolean existsActiveTokenForUserAndDoctor(
            @Param("userId") Long userId,
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Query("SELECT COUNT(t) > 0 FROM Token t " +
            "WHERE t.user.id = :userId " +
            "  AND t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    boolean existsActiveTokenForUserAndBranchService(
            @Param("userId") Long userId,
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    // =========================================================================
    // CANCEL — null out slot fields
    // =========================================================================

    @Modifying
    @Query("UPDATE Token t SET t.scheduledTime = NULL, t.slotEndTime = NULL WHERE t.id = :tokenId")
    void clearScheduledTime(@Param("tokenId") Long tokenId);

    // =========================================================================
    // POST-CANCELLATION RECALCULATION (legacy fallback — no shift filter)
    // =========================================================================

    @Query("SELECT t FROM Token t JOIN FETCH t.user " +
            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
            "  AND t.tokenNumber > :cancelledTokenNumber AND t.status = 'BOOKED' " +
            "ORDER BY t.tokenNumber ASC")
    List<Token> findBookedTokensAfterForDoctor(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("cancelledTokenNumber") Integer cancelledTokenNumber);

    @Query("SELECT t FROM Token t JOIN FETCH t.user " +
            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
            "  AND t.tokenNumber > :cancelledTokenNumber AND t.status = 'BOOKED' " +
            "ORDER BY t.tokenNumber ASC")
    List<Token> findBookedTokensAfterForBranchService(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date,
            @Param("cancelledTokenNumber") Integer cancelledTokenNumber);

    // =========================================================================
    // QUEUE LISTINGS
    // =========================================================================

    @Query("SELECT t FROM Token t JOIN FETCH t.user " +
            "WHERE t.doctor.id = :doctorId AND t.bookingDate = :date " +
            "ORDER BY t.tokenNumber ASC")
    List<Token> findDoctorQueueForDate(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t JOIN FETCH t.user " +
            "WHERE t.branchService.id = :branchServiceId AND t.bookingDate = :date " +
            "ORDER BY t.tokenNumber ASC")
    List<Token> findBranchServiceQueueForDate(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    // =========================================================================
    // CURRENTLY SERVING / NEXT
    // =========================================================================

    @Query("SELECT t FROM Token t " +
            "WHERE t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date AND t.status = 'IN_PROGRESS'")
    Optional<Token> findCurrentlyServingForDoctor(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date AND t.status = 'IN_PROGRESS'")
    Optional<Token> findCurrentlyServingForBranchService(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t " +
            "WHERE t.doctor.id = :doctorId " +
            "  AND t.bookingDate = :date AND t.status = 'BOOKED' " +
            "ORDER BY t.tokenNumber ASC LIMIT 1")
    Optional<Token> findNextTokenForDoctor(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t " +
            "WHERE t.branchService.id = :branchServiceId " +
            "  AND t.bookingDate = :date AND t.status = 'BOOKED' " +
            "ORDER BY t.tokenNumber ASC LIMIT 1")
    Optional<Token> findNextTokenForBranchService(
            @Param("branchServiceId") Long branchServiceId,
            @Param("date") LocalDate date);

    // =========================================================================
    // USER HISTORY
    // =========================================================================

    @Query("SELECT t FROM Token t " +
            "LEFT JOIN FETCH t.doctor LEFT JOIN FETCH t.branchService LEFT JOIN FETCH t.branch " +
            "WHERE t.user.id = :userId AND t.deletedByUser = false " +
            "ORDER BY t.bookingDate DESC, t.createdAt DESC")
    List<Token> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Token t " +
            "LEFT JOIN FETCH t.doctor LEFT JOIN FETCH t.branchService LEFT JOIN FETCH t.branch " +
            "WHERE t.user.id = :userId " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS') " +
            "  AND t.bookingDate >= :today " +
            "ORDER BY t.bookingDate ASC, t.tokenNumber ASC")
    List<Token> findActiveTokensByUserId(
            @Param("userId") Long userId,
            @Param("today") LocalDate today);

    @Query("SELECT t FROM Token t " +
            "JOIN FETCH t.user JOIN FETCH t.branch " +
            "LEFT JOIN FETCH t.doctor LEFT JOIN FETCH t.branchService " +
            "WHERE t.id = :tokenId")
    Optional<Token> findByIdWithDetails(@Param("tokenId") Long tokenId);

    // =========================================================================
    // ACTIVE TOKENS WITH SCHEDULED TIME — 1-hour cooldown check
    // =========================================================================

    @Query("SELECT t FROM Token t " +
            "LEFT JOIN FETCH t.doctor " +
            "LEFT JOIN FETCH t.branchService " +
            "WHERE t.user.id = :userId " +
            "  AND t.bookingDate = :date " +
            "  AND t.scheduledTime IS NOT NULL " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    List<Token> findActiveTokensWithScheduledTimeForUserOnDate(
            @Param("userId") Long userId,
            @Param("date") LocalDate date);

    @Query("SELECT t FROM Token t " +
            "LEFT JOIN FETCH t.doctor " +
            "LEFT JOIN FETCH t.branchService " +
            "WHERE t.user.id = :userId " +
            "  AND t.bookingDate = :date " +
            "  AND t.status NOT IN ('CANCELLED','COMPLETED','NO_SHOW')")
    List<Token> findActiveTokensForUserOnDate(
            @Param("userId") Long userId,
            @Param("date") LocalDate date);

    // =========================================================================
    // BRANCH QUERIES
    // =========================================================================

    // ✅ FIXED: renamed from findByBranchId → findByBranch_Id
    //    AdminService and SuperAdminService both call findByBranch_Id(branchId)
    @Query("SELECT t FROM Token t WHERE t.branch.id = :branchId")
    List<Token> findByBranch_Id(@Param("branchId") Long branchId);

    // =========================================================================
    // BRANCH DELETION — native queries
    // =========================================================================

    @Query("SELECT COUNT(t) FROM Token t " +
            "WHERE t.branch.id = :branchId " +
            "  AND t.status IN ('BOOKED','CALLED','IN_PROGRESS')")
    long countActiveTokensByBranchId(@Param("branchId") Long branchId);

    @Modifying
    @Query(value = "DELETE FROM tokens WHERE branch_id = :branchId", nativeQuery = true)
    void deleteAllTokensByBranchIdNative(@Param("branchId") Long branchId);

    @Modifying
    @Query(value = "DELETE FROM tokens WHERE doctor_id IN " +
            "(SELECT id FROM doctors WHERE branch_id = :branchId)", nativeQuery = true)
    void deleteAllTokensByDoctorBranchIdNative(@Param("branchId") Long branchId);

    // ─────────────────────────────────────────────────────────────
    // NEW: Get all booked scheduled times for a shift (CRITICAL FIX)
    // ─────────────────────────────────────────────────────────────
    @Query("SELECT t.scheduledTime FROM Token t " +
            "WHERE t.bookingDate = :date " +
            "  AND t.shiftType = :shift " +
            "  AND t.status NOT IN ('CANCELLED', 'COMPLETED', 'NO_SHOW') " +
            "  AND ((:isDoctor = true AND t.doctor.id = :entityId) " +
            "    OR (:isDoctor = false AND t.branchService.id = :entityId))")
    List<LocalTime> findBookedScheduledTimes(
            @Param("entityId") Long entityId,
            @Param("isDoctor") boolean isDoctor,
            @Param("date") LocalDate date,
            @Param("shift") Token.ShiftType shift);
}