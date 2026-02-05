package com.unki11.bestorder.service;

import com.unki11.bestorder.domain.User;
import com.unki11.bestorder.dto.request.LoginRequest;
import com.unki11.bestorder.dto.response.LoginResponse;
import com.unki11.bestorder.repository.UserRepository;
import com.unki11.bestorder.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        // 1. 이메일로 사용자 찾기
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        // 2. 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다");
        }

        // 3. 활성화 여부 체크
        if (!user.getIsActive()) {
            throw new RuntimeException("비활성화된 계정입니다");
        }

        // 4. JWT 토큰 생성
        String token = jwtUtil.generateToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole()
        );

        // 5. 응답 생성
        return LoginResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .name(user.getName())
                .role(user.getRole())
                .message("로그인 성공")
                .build();
    }
}