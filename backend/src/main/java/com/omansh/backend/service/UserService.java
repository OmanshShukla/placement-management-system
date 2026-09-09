package com.omansh.backend.service;

import com.omansh.backend.dto.LoginRequest;
import com.omansh.backend.dto.RegisterRequest;
import com.omansh.backend.dto.RegisterResponse;
import com.omansh.backend.entity.Role;
import com.omansh.backend.entity.User;
import com.omansh.backend.jwt.JwtService;
import com.omansh.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.omansh.backend.exception.DuplicateEmailException;
@Service
public class UserService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    public String login(LoginRequest request) {

        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!encoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid Password");
        }

        return jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );
    }

    public RegisterResponse register(RegisterRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateEmailException("Email already registered");
        }
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                encoder.encode(request.getPassword())
        );
        user.setRole(
                Role.valueOf(
                        request.getRole()
                                .toString()
                                .toUpperCase()
                )
        );

        User savedUser = repository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }
}