package com.unki11.bestorder.order.controller;

import com.unki11.bestorder.order.dto.OrderRequestDto;
import com.unki11.bestorder.order.dto.OrderResponseDto;
import com.unki11.bestorder.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders/mobile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderMobileController {

    private final OrderService orderService;

    // 모바일 주문 접수 (신규 및 추가 주문 통합)
    @PostMapping
    public ResponseEntity<Long> placeOrder(@RequestBody OrderRequestDto requestDto) {
        // 서비스 로직 실행 후 최종 orderId 반환
        Long orderId = orderService.processMobileOrder(requestDto);
        return ResponseEntity.ok(orderId);
    }

}