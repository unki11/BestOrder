package com.unki11.bestorder.auth.dto.request;

import com.unki11.bestorder.auth.Enum.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserJoinRequest {
    private String username;
    private String email;
    private String password;
    private String name;
    private String phone;
    private UserRole role; // 'OWNER' 또는 'STAFF'
}