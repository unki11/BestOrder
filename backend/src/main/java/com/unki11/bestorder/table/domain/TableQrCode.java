package com.unki11.bestorder.table.domain;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableQrCode {
    private Long qrId;
    private Long storeId;
    private Long tableId;
    private String qrToken;
    private String qrUrl;
    private String qrImageData;
    private String status; // 'ACTIVE', 'EXPIRED', 'REVOKED'
    private String useYn;
    private LocalDateTime expiresAt;

    // 감사(Audit) 필드
    private LocalDateTime createdAt;
    private Long createdUser;
    private LocalDateTime updatedAt;
    private Long updatedUser;
}