package com.unki11.bestorder.auth.controller;

import com.unki11.bestorder.auth.dto.request.LoginRequest;
import com.unki11.bestorder.auth.dto.request.UserJoinRequest;
import com.unki11.bestorder.auth.dto.response.LoginResponse;
import com.unki11.bestorder.auth.service.AuthService;
import com.unki11.bestorder.common.error.Enum.ErrorCode;
import com.unki11.bestorder.common.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 프론트엔드 연동용
public class LoginController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-username")
    public ResponseEntity<Void> checkUsername(@RequestParam String username) {
        System.out.println("checkUsername :" + authService.existsByUsername(username));

        if (authService.existsByUsername(username)) {
            // 중복이면 409 에러와 함께 "이미 사용 중인 아이디입니다" 던짐
            throw new BusinessException(ErrorCode.DUPLICATE_USERNAME);
        }
        return ResponseEntity.ok().build(); // 중복 아니면 빈 200 OK
    }

    @GetMapping("/check-email")
    public ResponseEntity<Void> checkEmail(@RequestParam String email) {
        System.out.println("checkEmail :" + authService.existsByUsername(email));

        if (authService.existsByEmail(email)) {
            // 중복이면 409 에러와 함께 "이미 사용 중인 이메일입니다" 던짐
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }
        return ResponseEntity.ok().build(); // 중복 아니면 빈 200 OK
    }

    @PostMapping("/join")
    public ResponseEntity<Void> join(@RequestBody UserJoinRequest request) {
        authService.join(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}