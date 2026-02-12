package com.unki11.bestorder.auth.controller;

import com.unki11.bestorder.auth.dto.request.LoginRequest;
import com.unki11.bestorder.auth.dto.response.LoginResponse;
import com.unki11.bestorder.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 프론트엔드 연동용
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        System.out.println("request : " + request);

        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}