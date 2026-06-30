//package com.example.Queue_Master.config;
//
//import com.example.Queue_Master.security.JwtFilter;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfigurationSource;
//
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity
//@RequiredArgsConstructor
//public class SecurityConfig {
//
//    private final CorsConfigurationSource corsConfigurationSource;
//    private final JwtFilter jwtFilter;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http)
//            throws Exception {
//        http
//                .cors(cors -> cors.configurationSource(corsConfigurationSource))
//                .csrf(AbstractHttpConfigurer::disable)
//                .sessionManagement(session ->
//                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authorizeHttpRequests(auth -> auth
//
//                        // ── Fully public ──────────────────────────────────────
//                        .requestMatchers(
//                                "/api/register",
//                                "/api/login",
//                                "/api/categories",
//                                "/api/branches/**",
//                                "/api/doctors/**",
//                                "/api/branch-services/**",
//                                "/api/users/**"
//                        ).permitAll()
//
//                        // ── Queue status — public ─────────────────────────────
//                        .requestMatchers(
//                                "/api/v1/tokens/doctor/*/queue-status",
//                                "/api/v1/tokens/branch-service/*/queue-status"
//                        ).permitAll()
//
//                        // ── Super Admin only ──────────────────────────────────
//                        .requestMatchers(
//                                "/api/super-admin/**"
//                        ).hasRole("SUPER_ADMIN")
//
//                        // ── Admin — ADMIN + SUPER_ADMIN ───────────────────────
//                        .requestMatchers(
//                                "/api/admin/**",
//                                "/api/create-staff"
//                        ).hasAnyRole("ADMIN", "SUPER_ADMIN")
//
//                        // ── Staff actions — STAFF + ADMIN + SUPER_ADMIN ───────
//                        .requestMatchers(
//                                "/api/v1/tokens/doctor/*/call-next",
//                                "/api/v1/tokens/branch-service/*/call-next"
//                        ).hasAnyRole("STAFF", "ADMIN", "SUPER_ADMIN")
//
//                        // ── Token booking — USER + ADMIN + SUPER_ADMIN ────────
//                        .requestMatchers(
//                                "/api/v1/tokens/book",
//                                "/api/v1/tokens/*/cancel",
//                                "/api/v1/tokens/user/**"
//                        ).hasAnyRole("USER", "ADMIN", "SUPER_ADMIN")
//
//                        // ── Everything else — must be authenticated ───────────
//                        .anyRequest().authenticated()
//                        // ── Staff endpoints ────────────────────────────────────
//                        .requestMatchers("/api/staff/**")
//                        .hasAnyRole("STAFF", "ADMIN", "SUPER_ADMIN")
//                )
//                .addFilterBefore(jwtFilter,
//                        UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//}












package com.example.Queue_Master.config;

import com.example.Queue_Master.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ── Fully public ──────────────────────────────────────
                        .requestMatchers(
                                "/api/register",
                                "/api/login",
                                "/api/categories",
                                "/api/branches/**",
                                "/api/doctors/**",
                                "/api/branch-services/**",
                                "/api/users/**"
                        ).permitAll()

                        // ── Queue status — public ─────────────────────────────
                        .requestMatchers(
                                "/api/v1/tokens/doctor/*/queue-status",
                                "/api/v1/tokens/branch-service/*/queue-status"
                        ).permitAll()

                        // ── Super Admin only ──────────────────────────────────
                        .requestMatchers(
                                "/api/super-admin/**"
                        ).hasRole("SUPER_ADMIN")

                        // ── Admin — ADMIN + SUPER_ADMIN ───────────────────────
                        .requestMatchers(
                                "/api/admin/**",
                                "/api/create-staff"
                        ).hasAnyRole("ADMIN", "SUPER_ADMIN")

                        // ── Staff endpoints — STAFF + ADMIN + SUPER_ADMIN ─────
                        .requestMatchers(
                                "/api/staff/**"
                        ).hasAnyRole("STAFF", "ADMIN", "SUPER_ADMIN")

                        // ── Staff actions — STAFF + ADMIN + SUPER_ADMIN ───────
                        .requestMatchers(
                                "/api/v1/tokens/doctor/*/call-next",
                                "/api/v1/tokens/branch-service/*/call-next"
                        ).hasAnyRole("STAFF", "ADMIN", "SUPER_ADMIN")

                        // ── Token booking — any authenticated role ────────────
                        .requestMatchers(
                                "/api/v1/tokens/book",
                                "/api/v1/tokens/*/cancel",
                                "/api/v1/tokens/user/**"
                        ).hasAnyRole("USER", "STAFF", "ADMIN", "SUPER_ADMIN")

                        // ── Notifications — any authenticated role ────────────
                        .requestMatchers(
                                "/api/v1/notifications/**"
                        ).hasAnyRole("USER", "STAFF", "ADMIN", "SUPER_ADMIN")

                        // ── Chatbot — any authenticated role ──────────────────
                        .requestMatchers(
                                "/api/v1/chat/**"
                        ).hasAnyRole("USER", "STAFF", "ADMIN", "SUPER_ADMIN")

                        // ── Everything else — must be authenticated ───────────
                        // ✅ anyRequest() MUST always be LAST
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}