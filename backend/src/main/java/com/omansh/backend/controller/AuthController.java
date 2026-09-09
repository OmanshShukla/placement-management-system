package com.omansh.backend.controller;
import jakarta.validation.Valid;
import com.omansh.backend.dto.RegisterRequest;
import com.omansh.backend.entity.User;
import com.omansh.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.omansh.backend.dto.LoginRequest;
import com.omansh.backend.dto.LoginResponse;
import com.omansh.backend.dto.RegisterResponse;
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request)  {

        String token = userService.login(request);

        return new LoginResponse(token);
    }
}