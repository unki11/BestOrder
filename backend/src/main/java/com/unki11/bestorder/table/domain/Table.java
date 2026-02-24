package com.unki11.bestorder.table.domain;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Table {
    private Long tableId;
    private Long storeId;
    private Long tableGrpId;
    private Integer tableNumber;
    private String tableName;
    private Integer tablePosition;
    private Integer capacity;
    private String status; // EMPTY, SEATED, ORDERING, COOKING, PAYMENT
    private String useYn;
    private String qrToken;
    private LocalDateTime qrGeneratedAt;

    private LocalDateTime createdAt;
    private Long createdUser;
    private LocalDateTime updatedAt;
    private Long updatedUser;
}