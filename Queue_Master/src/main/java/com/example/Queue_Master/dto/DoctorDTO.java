package com.example.Queue_Master.dto;

public record DoctorDTO(
        Long id,
        String name,
        String specialization,
        String experience,
        String timing,
        double rating,
        String status,
        int avgConsultationTime,
        Long branchId,
        String branchName   // optional – safe to include without lazy loading
) {}