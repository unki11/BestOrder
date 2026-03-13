package com.unki11.bestorder.order.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderTableDto {
    private Long tableId;
    private Long orderId;
    private Long storeId;
    private Long tableGrpId;
    private Integer tableNumber;
    private String tableName;
    private Integer tablePosition;
    private Integer capacity;
    private String status;
    private Long totalPrice; // 주문이 없으면 COALESCE에 의해 0으로 들어옵니다
}