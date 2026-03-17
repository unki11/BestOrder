package com.unki11.bestorder.order.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderResponseDto {
    private Long orderId;
    private Long tableId;
    private String tableName;
    private String orderStatus;
    private Integer totalAmount;

    // MyBatis에서 1:N 매핑을 통해 리스트로 들어옵니다.
    private List<OrderItemDto> items;
}