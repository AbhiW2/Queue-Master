package com.example.Queue_Master.dto;

public record BranchDTO(
        Long id,
        String name,
        String status,
        String time,
        String location,
        Long categoryId
) {}