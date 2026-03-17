package com.unki11.bestorder.order.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItemRequestDto {
    private Long orderId;      // Service에서 세팅할 용도
    private Long menuId;
    private String menuName;
    private Integer quantity;
    private Integer unitPrice;
    private Integer subtotal;
    private String options;
}