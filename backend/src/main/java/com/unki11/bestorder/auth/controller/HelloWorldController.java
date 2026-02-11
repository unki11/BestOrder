package com.unki11.bestorder.auth.controller;

import com.unki11.bestorder.auth.domain.User;
import com.unki11.bestorder.auth.dto.request.LoginRequest;
import com.unki11.bestorder.auth.dto.response.LoginResponse;
import com.unki11.bestorder.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HelloWorldController {

    private final UserRepository userRepository;

    @GetMapping("/login")
    public LoginResponse hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "백엔드에서 보낸 메시지입니다!");
        response.put("status", "success");

        LoginRequest request = new LoginRequest();
        request.setEmail("admin@bestorder.com");

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        return LoginResponse.builder()
                .token("dummy-token-12345") // 아직 토큰 기능이 없다면 임시값
                .name(user.getName())
                .role(user.getRole())
                .message("백엔드에서 성공적으로 로그인 정보를 가져왔습니다.")
                .build();
    }
}
