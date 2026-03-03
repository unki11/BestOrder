package com.unki11.bestorder.menu.domain;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuGrp {
    private Long menuGrpId;
    private Long storeId;
    private String menuGrpName;
    private String useYn;
    private Integer menuGrpPosition;

    // 계층형 조회를 위한 하위 메뉴 리스트
    private List<Menu> menuList;

    private LocalDateTime createdAt;
    private Long createdUser;
    private LocalDateTime updatedAt;
    private Long updatedUser;
}