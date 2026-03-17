package com.unki11.bestorder.order.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderRequestDto {
    private Long orderId;      // 신규 주문일 경우 null
    private Long tableId;      // 테이블 번호
    private Long storeId;      // 매장 번호
    private Integer totalAmount; // 총 결제 금액

    private List<OrderItemRequestDto> items;
}