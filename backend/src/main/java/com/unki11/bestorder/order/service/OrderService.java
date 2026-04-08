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

    // [추가] 모바일 주문 처리 로직 (합석/추가주문 고려)
    @Transactional
    public Long processMobileOrder(OrderRequestDto request) {
        // 1. 해당 테이블의 오늘 활성화된(status '0') 주문이 있는지 확인
        Long activeOrderId = orderRepository.findActiveOrderId(request.getTableId(), request.getStoreId());

        if (activeOrderId != null) {
            // 2-1. 기존 주문이 존재하는 경우 (추가 주문)
            request.setOrderId(activeOrderId);
            // 기존 총 금액에 이번 주문 금액을 더함 (+)
            orderRepository.addOrderTotalAmount(request);
        } else {
            // 2-2. 기존 주문이 없는 경우 (신규 주문)
            // insertOrder 실행 후 request.orderId에 새로 생성된 PK값이 자동으로 세팅됨 (useGeneratedKeys)
            orderRepository.insertOrder(request);
        }

        // 3. 주문 아이템 등록 (이번에 새로 담은 메뉴들만 추가 삽입)
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderItemRequestDto item : request.getItems()) {
                item.setOrderId(request.getOrderId()); // 생성되거나 찾아온 orderId 매핑
            }
            orderRepository.insertOrderItems(request.getItems());
        }

        return request.getOrderId();
    }
}