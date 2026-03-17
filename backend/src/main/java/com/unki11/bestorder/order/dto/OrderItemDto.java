package com.unki11.bestorder.order.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItemDto {
    private Long menuId;
    private String menuName;
    private Integer quantity;
    private Integer unitPrice;
    private Integer subtotal;
    private String options;
}