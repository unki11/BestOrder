package com.unki11.bestorder.orderTable.service;

import com.unki11.bestorder.orderTable.domain.TableGrpDto;
import com.unki11.bestorder.orderTable.repository.OrderTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderTableService {

    private final OrderTableRepository orderRepository;

    /**
     * 매장별 테이블 현황 및 주문 금액 조회
     * (테이블 그룹 내부에 OrderTableDto 리스트가 포함된 형태 반환)
     */
    @Transactional(readOnly = true)
    public List<TableGrpDto> getTablesWithOrderAmount(Long storeId) {
        return orderRepository.selectTablesWithOrderAmount(storeId);
    }

    // 주문 생성, 결제, 합산, 이동 등의 비즈니스 로직은 추후 이쪽에 추가하시면 됩니다.
}