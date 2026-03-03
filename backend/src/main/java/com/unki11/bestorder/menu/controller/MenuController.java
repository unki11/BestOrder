package com.unki11.bestorder.menu.controller;

import com.unki11.bestorder.menu.domain.Menu;
import com.unki11.bestorder.menu.domain.MenuGrp;
import com.unki11.bestorder.menu.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuService menuService;

    // 1. 매장별 전체 메뉴 레이아웃 조회 (왼쪽 사이드바 그룹 + 오른쪽 메뉴 그리드용 데이터)
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<MenuGrp>> getMenuLayout(@PathVariable Long storeId) {
        return ResponseEntity.ok(menuService.getMenuLayout(storeId));
    }

    // 2. 메뉴 그룹 등록 및 수정 (Upsert) - 사이드바 관리용
    @PostMapping("/group")
    public ResponseEntity<String> saveMenuGrp(@RequestBody MenuGrp menuGrp) {
        menuService.saveMenuGrp(menuGrp);
        return ResponseEntity.ok("메뉴 그룹 정보가 저장되었습니다.");
    }

    // 3. 메뉴 등록 및 수정 (Upsert) - 오른쪽 그리드 내 메뉴 관리용
    @PostMapping
    public ResponseEntity<String> saveMenu(@RequestBody Menu menu) {
        menuService.saveMenu(menu);
        return ResponseEntity.ok("메뉴 정보가 저장되었습니다.");
    }

    // 4. 메뉴 품절 상태 변경 (1: 판매가능, 0: 품절)
    @PatchMapping("/{menuId}/availability")
    public ResponseEntity<String> updateAvailability(@PathVariable Long menuId,
                                                     @RequestParam Integer isAvailable,
                                                     @RequestParam Long userId) {
        menuService.changeMenuAvailability(menuId, isAvailable, userId);
        return ResponseEntity.ok("메뉴 판매 상태가 변경되었습니다.");
    }

    // 5. 메뉴 그룹 삭제
    @DeleteMapping("/group/{menuGrpId}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long menuGrpId,
                                              @RequestParam Long userId) {
        menuService.removeMenuGrp(menuGrpId, userId);
        return ResponseEntity.ok("메뉴 그룹이 삭제되었습니다.");
    }

    // 6. 메뉴 상세 삭제
    @DeleteMapping("/{menuId}")
    public ResponseEntity<String> deleteMenu(@PathVariable Long menuId,
                                             @RequestParam Long userId) {
        menuService.removeMenu(menuId, userId);
        return ResponseEntity.ok("메뉴가 삭제되었습니다.");
    }
}