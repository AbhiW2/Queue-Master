//package com.example.Queue_Master.dto;
//
//import com.example.Queue_Master.entity.Token.QueueType;
//import com.example.Queue_Master.entity.Token.TokenStatus;
//import lombok.Builder;
//import lombok.Data;
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.time.LocalDateTime;
//
//@Data
//@Builder
//public class TokenResponse {
//
//    private Long        tokenId;
//    private String      displayToken;
//    private Integer     tokenNumber;
//    private Integer     queuePosition;
//    private Integer     estimatedWaitTimeMinutes;
//    private QueueType   queueType;
//    private TokenStatus status;
//    private LocalDate   bookingDate;
//    private LocalTime   scheduledTime;
//    private LocalTime   slotEndTime;
//    private Integer     slotDurationMinutes;
//
//    private Long   doctorId;
//    private String doctorName;
//    private String doctorSpecialization;
//    private String doctorTiming;
//
//    private Long   branchServiceId;
//    private String branchServiceName;
//    private String branchServiceCounter;
//    private String branchServiceTiming;
//
//    private Long   branchId;
//    private String branchName;
//    private String branchLocation;
//
//    private Long   userId;
//    private String userName;
//
//    private LocalDateTime bookedAt;
//    private String        message;
//}

















package com.example.Queue_Master.dto;

import com.example.Queue_Master.entity.Token;
import com.example.Queue_Master.entity.Token.QueueType;
import com.example.Queue_Master.entity.Token.TokenStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Builder
public class TokenResponse {

    private Long        tokenId;
    private String      displayToken;
    private Integer     tokenNumber;
    private Integer     queuePosition;
    private Integer     estimatedWaitTimeMinutes;
    private QueueType   queueType;
    private TokenStatus status;
    private LocalDate   bookingDate;
    private LocalTime   scheduledTime;
    private LocalTime   slotEndTime;
    private Integer     slotDurationMinutes;
    private Token.ShiftType shift;
    private String      shiftLabel;   // e.g. "Morning (9:00 AM – 1:00 PM)"

    private Long   doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorTiming;

    private Long   branchServiceId;
    private String branchServiceName;
    private String branchServiceCounter;
    private String branchServiceTiming;

    private Long   branchId;
    private String branchName;
    private String branchLocation;

    private Long   userId;
    private String userName;

    private LocalDateTime bookedAt;
    private String        message;
}
