package com.unki11.bestorder.util;

import com.unki11.bestorder.common.error.Enum.ErrorCode;
import com.unki11.bestorder.common.error.dto.ErrorResponse;
import com.unki11.bestorder.common.error.exception.BusinessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class) // 커스텀 예외 발생 시
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        ErrorCode errorCode = e.getErrorCode();

        ErrorResponse response = ErrorResponse.builder()
                .code(errorCode.getCode())
                .message(e.getMessage()) // Enum의 기본 메시지 대신 throw 할 때 적은 메시지 사용 가능
                .build();

        return new ResponseEntity<>(response, errorCode.getHttpStatus());
    }
}