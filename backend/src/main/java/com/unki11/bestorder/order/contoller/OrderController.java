package com.unki11.bestorder.order.contoller;

import com.unki11.bestorder.menu.domain.MenuGrp;
import com.unki11.bestorder.menu.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final MenuService menuService;

    // 1. 매장별 전체 메뉴 레이아웃 조회 (왼쪽 사이드바 그룹 + 오른쪽 메뉴 그리드용 데이터)
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<MenuGrp>> getMenuLayout(@PathVariable Long storeId) {
        return ResponseEntity.ok(menuService.getMenuLayout(storeId));
    }
}
