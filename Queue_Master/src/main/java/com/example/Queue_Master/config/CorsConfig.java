package com.example.Queue_Master.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**")
                        .allowedOrigins("*")   // Allow all origins (for development)
                        .allowedMethods("*")   // Allow GET, POST, PUT, DELETE
                        .allowedHeaders("*")   // Allow all headers
                        .allowCredentials(false);
            }
        };
    }
}