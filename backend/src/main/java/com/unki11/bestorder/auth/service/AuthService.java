package com.unki11.bestorder.auth.service;

import com.unki11.bestorder.auth.domain.User;
import com.unki11.bestorder.auth.dto.request.LoginRequest;
import com.unki11.bestorder.auth.dto.response.LoginResponse;
import com.unki11.bestorder.auth.repository.UserRepository;
import com.unki11.bestorder.common.error.Enum.ErrorCode;
import com.unki11.bestorder.common.error.exception.BusinessException;
import com.unki11.bestorder.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public LoginResponse login(LoginRequest request) {
        // 1. 사용자 조회 (MyBatis 혹은 JPA)
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        String abc = passwordEncoder.encode("123");

        // 2. 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD);
        }

        // 3. 토큰 생성 및 반환
        String token = jwtProvider.createToken(user);
        return LoginResponse.builder()
                .token(token) // 아직 토큰 기능이 없다면 임시값
                .name(user.getName())
                .role(user.getRole())
                .username(user.getUsername())
                .build();
    }
}