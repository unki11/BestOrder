package com.unki11.bestorder.order.controller;

import com.unki11.bestorder.order.dto.TableGrpDto;
import com.unki11.bestorder.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    /**
     * 1. 매장별 테이블 현황 및 현재 주문 금액 조회 (주문 메인 화면용)
     */
    @GetMapping("/table/store/{storeId}")
    public ResponseEntity<List<TableGrpDto>> getTableStatusWithOrder(@PathVariable Long storeId) {
        List<TableGrpDto> result = orderService.getTablesWithOrderAmount(storeId);
        return ResponseEntity.ok(result);
    }

    // 향후 추가될 API 예시들:
    // @PostMapping("/move") -> 테이블 이동 (handleMoveTable 연동)
    // @PostMapping("/merge") -> 테이블 합산 (handleMergeTable 연동)
    // @GetMapping("/{orderId}/receipt") -> 영수증 상세 조회
}