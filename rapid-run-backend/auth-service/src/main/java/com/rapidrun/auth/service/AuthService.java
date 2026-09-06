package com.rapidrun.auth.service;

import com.rapidrun.auth.dto.*;
import com.rapidrun.auth.model.User;
import com.rapidrun.auth.repository.UserRepository;
import com.rapidrun.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalArgumentException("Email already registered");

        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .build();

        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return buildResponse(token, user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new IllegalArgumentException("Invalid email or password");

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return buildResponse(token, user);
    }

    private AuthResponse buildResponse(String token, User user) {
        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build())
            .build();
    }
}
