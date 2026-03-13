package com.unki11.bestorder.order.dto;

import lombok.*;
import java.util.List;
import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableGrpDto {
    private Long tableGrpId;
    private Long storeId;
    private String tableGrpName;
    private Integer tableGrpPosition;

    // 테이블이 비어있을 경우 null이 아닌 []로 반환하기 위해 초기화
    @Builder.Default
    private List<OrderTableDto> tableList = new ArrayList<>();
}