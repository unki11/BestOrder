package com.unki11.bestorder.menu.domain;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Menu {
    private Long menuId;
    private Long storeId;
    private Long menuGrpId;
    private String menuName;
    private Integer price;
    private String description;
    private String imageUrl;
    private Integer isAvailable; // 1: 가능, 0: 품절
    private String useYn;
    private Integer displayOrder;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // menus 테이블 설계에 따라 createdUser, updatedUser가 필요하다면 추가 가능합니다.
}