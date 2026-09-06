package com.rapidrun.auth.dto;
import lombok.*;

@Data @AllArgsConstructor @Builder
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data @AllArgsConstructor @Builder
    public static class UserDto {
        private String id;
        private String name;
        private String email;
    }
}
