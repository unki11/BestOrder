package com.unki11.bestorder.table.domain;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TableGrp {
    private Long tableGrpId;
    private Long storeId;
    private String tableGrpName;
    private Integer tableGrpPosition;
    private String useYn;

    // 계층형 조회를 위한 테이블 리스트
    private List<Table> tableList;

    private LocalDateTime createdAt;
    private Long createdUser;
    private LocalDateTime updatedAt;
    private Long updatedUser;
}