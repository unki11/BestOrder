package com.unki11.bestorder.order.repository;

import com.unki11.bestorder.order.dto.OrderRequestDto;
import com.unki11.bestorder.order.dto.OrderItemRequestDto;
import com.unki11.bestorder.order.dto.OrderResponseDto;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface OrderRepository {
    // 기존 상세 조회
    OrderResponseDto selectOrderDetails(Long orderId);

    // 신규 주문 생성 (생성된 order_id를 DTO에 반환받음)
    int insertOrder(OrderRequestDto requestDto);

    // 기존 주문 업데이트 (총 금액 등)
    int updateOrder(OrderRequestDto requestDto);

    // 기존 주문 아이템 전체 삭제 (재삽입을 위함)
    int deleteOrderItemsByOrderId(Long orderId);

    // 주문 아이템 다중 삽입 (Batch Insert)
    int insertOrderItems(List<OrderItemRequestDto> items);
}