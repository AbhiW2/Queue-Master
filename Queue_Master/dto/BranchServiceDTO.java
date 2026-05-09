package com.example.Queue_Master.dto;

public record BranchServiceDTO(
        Long id,
        String name,
        String description,
        String counter,
        String timing,
        String status,
        Long branchId,
        String branchName
) {}