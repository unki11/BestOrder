package com.unki11.bestorder.auth.service;

import com.unki11.bestorder.auth.domain.User;
import com.unki11.bestorder.auth.dto.request.LoginRequest;
import com.unki11.bestorder.auth.dto.request.UserJoinRequest;
import com.unki11.bestorder.auth.dto.response.LoginResponse;
import com.unki11.bestorder.auth.repository.UserRepository;
import com.unki11.bestorder.common.error.Enum.ErrorCode;
import com.unki11.bestorder.common.error.exception.BusinessException;
import com.unki11.bestorder.util.JwtProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

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

    public Boolean existsByUsername(String username) {

        System.out.println("userRepository existsByUsername:" + userRepository.existsByUsername(username));
        return userRepository.existsByUsername(username);
    }

    public Boolean existsByEmail(String email) {

        return userRepository.existsByEmail(email);
    }

    @Transactional
    public void join(UserJoinRequest request) {
        // 회원가입 직전 최종 중복 체크 (보안상 필수)
        if (existsByUsername(request.getUsername())) {
            throw new BusinessException(ErrorCode.DUPLICATE_USERNAME);
        }
        if (existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        // 비밀번호 암호화 후 빌드
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .role(request.getRole())
                .build();

        userRepository.save(user);
    }
}