package com.example.Queue_Master.entity;

public enum Role {
    USER,        // customer who books tokens
    STAFF,       // doctor / counter staff
    ADMIN,       // hospital manager / branch manager
    SUPER_ADMIN  // system owner — manages all branches and admins
}