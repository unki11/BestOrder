package com.unki11.bestorder.auth.dto.response;

import com.unki11.bestorder.auth.Enum.UserRole;
import lombok.*;

@Data
@Builder
@AllArgsConstructor(access = AccessLevel.PUBLIC) // 생성자 접근 권한을 public으로 명시
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA나 Jackson용
public class LoginResponse {
    private String token;
    private Long userId;
    private String name;
    private UserRole role;
    private String username;
}