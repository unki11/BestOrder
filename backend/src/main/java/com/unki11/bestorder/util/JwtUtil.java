package com.unki11.bestorder.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    // 0.12.x 버전에서는 SecretKey 타입을 사용하는 것이 권장됩니다.
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // JWT 토큰 생성
    public String generateToken(Long userId, String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(userId.toString())        // setSubject -> subject
                .claim("email", email)
                .claim("role", role)
                .issuedAt(now)                     // setIssuedAt -> issuedAt
                .expiration(expiryDate)            // setExpiration -> expiration
                .signWith(getSigningKey())         // 알고리즘 자동 선택
                .compact();
    }

    // 토큰에서 userId 추출
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()              // parserBuilder() -> parser()
                .verifyWith(getSigningKey())       // setSigningKey -> verifyWith
                .build()
                .parseSignedClaims(token)          // parseClaimsJws -> parseSignedClaims
                .getPayload();                     // getBody -> getPayload

        return Long.parseLong(claims.getSubject());
    }

    // 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // 프로젝트 로그 라이브러리(SLF4J 등)가 있다면 여기에 로그를 남기면 좋습니다.
            return false;
        }
    }
}