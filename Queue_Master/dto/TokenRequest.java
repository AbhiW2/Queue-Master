//
//package com.example.Queue_Master.dto;
//
//import com.example.Queue_Master.entity.Token.QueueType;
//import jakarta.validation.constraints.NotNull;
//import lombok.Data;
//import java.time.LocalDate;
//import java.time.LocalTime;
//
//@Data
//public class TokenRequest {
//
//    @NotNull(message = "Queue type is required")
//    private QueueType queueType;
//
//    private Long doctorId;
//
//    private Long branchServiceId;
//
//    @NotNull(message = "Booking date is required")
//    private LocalDate bookingDate;
//
//    // Optional: user-selected preferred time (HH:mm). Used to block past-time bookings for today.
//    private LocalTime bookingTime;
//
//    @NotNull(message = "User ID is required")
//    private Long userId;
//}














package com.example.Queue_Master.dto;

import com.example.Queue_Master.entity.Token.QueueType;
import com.example.Queue_Master.entity.Token.ShiftType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TokenRequest {

    @NotNull(message = "Queue type is required")
    private QueueType queueType;

    private Long doctorId;

    private Long branchServiceId;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    /**
     * Shift selection:
     *   MORNING   → 09:00 AM – 01:00 PM, max 20 tokens
     *   AFTERNOON → 02:00 PM – 05:00 PM, max 15 tokens
     */
    @NotNull(message = "Shift is required (MORNING or AFTERNOON)")
    private ShiftType shift;

    @NotNull(message = "User ID is required")
    private Long userId;
}