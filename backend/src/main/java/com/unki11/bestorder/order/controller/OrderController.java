package com.unki11.bestorder.order.controller;

import com.unki11.bestorder.order.dto.OrderRequestDto;
import com.unki11.bestorder.order.dto.OrderResponseDto;
import com.unki11.bestorder.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    // 기존 상세 조회
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDto> getOrderDetails(@PathVariable Long orderId) {
        OrderResponseDto response = orderService.getOrderDetails(orderId);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }

    // 신규 및 추가 주문 등록
    @PostMapping
    public ResponseEntity<String> createOrUpdateOrder(@RequestBody OrderRequestDto request) {
        Long savedOrderId = orderService.saveOrder(request);
        return ResponseEntity.ok("주문 처리가 완료되었습니다. 주문 번호: " + savedOrderId);
    }
}