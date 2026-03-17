package com.unki11.bestorder.order.service;

import com.unki11.bestorder.order.dto.OrderItemRequestDto;
import com.unki11.bestorder.order.dto.OrderRequestDto;
import com.unki11.bestorder.order.dto.OrderResponseDto;
import com.unki11.bestorder.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    // 기존 상세 조회
    public OrderResponseDto getOrderDetails(Long orderId) {
        return orderRepository.selectOrderDetails(orderId);
    }

    // 주문 저장 로직 (신규 및 추가)
    @Transactional
    public Long saveOrder(OrderRequestDto request) {
        if (request.getOrderId() == null) {
            // 1. 신규 주문 처리
            orderRepository.insertOrder(request); // 실행 후 request.orderId에 PK값 세팅됨
        } else {
            // 2. 추가/변경 주문 처리
            orderRepository.updateOrder(request);
            // 깔끔한 갱신을 위해 기존 아이템 날리기
            orderRepository.deleteOrderItemsByOrderId(request.getOrderId());
        }

        // 3. 주문 아이템 등록
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderItemRequestDto item : request.getItems()) {
                item.setOrderId(request.getOrderId()); // 생성/기존 orderId 매핑
            }
            orderRepository.insertOrderItems(request.getItems());
        }

        return request.getOrderId();
    }
}