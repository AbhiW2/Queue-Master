package com.example.Queue_Master.dto;

public class TokenRequest {

    private Long userId;
    private Long doctorId;         // optional
    private Long branchServiceId;  // required

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public Long getBranchServiceId() {
        return branchServiceId;
    }

    public void setBranchServiceId(Long branchServiceId) {
        this.branchServiceId = branchServiceId;
    }
}