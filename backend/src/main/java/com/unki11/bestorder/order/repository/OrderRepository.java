package com.unki11.bestorder.order.repository;

import com.unki11.bestorder.order.dto.TableGrpDto;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface OrderRepository {

    /**
     * 특정 매장의 그룹별 테이블 목록과 활성화된 주문 금액 조회
     * 매퍼 XML의 select id="selectTablesWithOrderAmount" 와 매핑됩니다.
     */
        List<TableGrpDto> selectTablesWithOrderAmount(Long storeId);

    // 필요 시 추가 주문 관련 메서드 작성 (예: insertOrder, updateOrderStatus 등)
}