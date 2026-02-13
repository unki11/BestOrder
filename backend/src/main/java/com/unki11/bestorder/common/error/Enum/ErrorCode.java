package com.unki11.bestorder.common.error.Enum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // Auth
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "AUTH_001", "비밀번호가 일치하지 않습니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "AUTH_002", "존재하지 않는 사용자입니다."),
    ACCOUNT_DISABLED(HttpStatus.FORBIDDEN, "AUTH_003", "비활성화된 계정입니다."),
    DUPLICATE_USERNAME(HttpStatus.FORBIDDEN, "AUTH_004", "중복되는 아이디입니다."),
    DUPLICATE_EMAIL(HttpStatus.FORBIDDEN, "AUTH_005", "중복되는 이메일입니다.");


    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}