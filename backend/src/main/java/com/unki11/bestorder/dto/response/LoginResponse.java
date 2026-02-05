package com.unki11.bestorder.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private Long userId;
    private String name;
    private String role;
    private String message;
}