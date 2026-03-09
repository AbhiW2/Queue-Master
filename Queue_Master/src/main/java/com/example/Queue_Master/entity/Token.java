package com.example.Queue_Master.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tokens")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token_number")
    private Integer tokenNumber;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    private String status;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "doctor_id", nullable = true)
    private Long doctorId;

    @Column(name = "branch_service_id", nullable = false)
    private Long branchServiceId;

    @Column(name = "estimated_wait_time")
    private Integer estimatedWaitTime;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(Integer tokenNumber) { this.tokenNumber = tokenNumber; }
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public Long getBranchServiceId() { return branchServiceId; }
    public void setBranchServiceId(Long branchServiceId) { this.branchServiceId = branchServiceId; }
    public Integer getEstimatedWaitTime() { return estimatedWaitTime; }
    public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }
}








//
//package com.example.Queue_Master.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDate;
//
//@Entity
//@Table(name = "tokens")
//public class Token {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "token_number")
//    private Integer tokenNumber;
//
//    @Column(name = "booking_date")
//    private LocalDate bookingDate;
//
//    private String status;
//
//    @Column(name = "user_id")
//    private Long userId;
//
//    @Column(name = "doctor_id", nullable = true)   // ← important: allow null
//    private Long doctorId;
//
//    @Column(name = "branch_service_id")
//    private Long branchServiceId;
//
//    @Column(name = "estimated_wait_time")
//    private Integer estimatedWaitTime;
//
//    // Getters and Setters
//    public Long getId() { return id; }
//    public Integer getTokenNumber() { return tokenNumber; }
//    public void setTokenNumber(Integer tokenNumber) { this.tokenNumber = tokenNumber; }
//    public LocalDate getBookingDate() { return bookingDate; }
//    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
//    public String getStatus() { return status; }
//    public void setStatus(String status) { this.status = status; }
//    public Long getUserId() { return userId; }
//    public void setUserId(Long userId) { this.userId = userId; }
//    public Long getDoctorId() { return doctorId; }
//    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
//    public Long getBranchServiceId() { return branchServiceId; }
//    public void setBranchServiceId(Long branchServiceId) { this.branchServiceId = branchServiceId; }
//    public Integer getEstimatedWaitTime() { return estimatedWaitTime; }
//    public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }
//}
