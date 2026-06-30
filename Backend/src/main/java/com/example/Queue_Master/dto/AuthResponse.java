package com.example.Queue_Master.dto;

import com.example.Queue_Master.entity.Role;

public class AuthResponse {

    private String token;
    private Long   userId;
    private String username;
    private String email;
    private String role;      // ✅ changed from Role enum to String
    private String message;

    public AuthResponse() {}

    // ✅ Constructor accepts Role enum and converts to String automatically
    public AuthResponse(String token, Long userId, String username,
                        String email, Role role, String message) {
        this.token    = token;
        this.userId   = userId;
        this.username = username;
        this.email    = email;
        this.role     = role != null ? role.name() : null; // ✅ "SUPER_ADMIN"
        this.message  = message;
    }

    // ✅ Overloaded constructor that accepts String role directly
    public AuthResponse(String token, Long userId, String username,
                        String email, String role, String message) {
        this.token    = token;
        this.userId   = userId;
        this.username = username;
        this.email    = email;
        this.role     = role;
        this.message  = message;
    }

    public String getToken()            { return token; }
    public void   setToken(String t)    { this.token = t; }
    public Long   getUserId()           { return userId; }
    public void   setUserId(Long id)    { this.userId = id; }
    public String getUsername()         { return username; }
    public void   setUsername(String u) { this.username = u; }
    public String getEmail()            { return email; }
    public void   setEmail(String e)    { this.email = e; }
    public String getRole()             { return role; }               // ✅ returns String
    public void   setRole(String r)     { this.role = r; }             // ✅ accepts String
    public void   setRole(Role r)       { this.role = r != null ? r.name() : null; } // ✅ accepts enum too
    public String getMessage()          { return message; }
    public void   setMessage(String m)  { this.message = m; }
}