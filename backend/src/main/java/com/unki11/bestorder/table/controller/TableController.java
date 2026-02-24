package com.unki11.bestorder.table.controller;

import com.unki11.bestorder.table.domain.Table;
import com.unki11.bestorder.table.domain.TableGrp;
import com.unki11.bestorder.table.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/table")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TableController {

    private final TableService tableService;

    // 1. 매장별 전체 테이블 그룹 및 테이블 조회
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<TableGrp>> getTableLayout(@PathVariable Long storeId) {
        return ResponseEntity.ok(tableService.getTableLayout(storeId));
    }

    // 2. 테이블 그룹 등록 및 수정 (Upsert)
    @PostMapping("/group")
    public ResponseEntity<String> saveTableGrp(@RequestBody TableGrp tableGrp) {
        tableService.saveTableGrp(tableGrp);
        return ResponseEntity.ok("테이블 그룹 정보가 저장되었습니다.");
    }

    // 3. 테이블 등록 및 수정 (Upsert)
    @PostMapping
    public ResponseEntity<String> saveTable(@RequestBody Table table) {
        tableService.saveTable(table);
        return ResponseEntity.ok("테이블 정보가 저장되었습니다.");
    }

    // 4. 테이블 상태 변경 (EMPTY, SEATED 등)
    @PatchMapping("/{tableId}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long tableId,
                                               @RequestParam String status,
                                               @RequestParam Long userId) {
        tableService.changeTableStatus(tableId, status, userId);
        return ResponseEntity.ok("테이블 상태가 변경되었습니다.");
    }

    // 5. 테이블 그룹 삭제 (Soft Delete)
    @DeleteMapping("/group/{tableGrpId}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long tableGrpId,
                                              @RequestParam Long userId) {
        tableService.removeTableGrp(tableGrpId, userId);
        return ResponseEntity.ok("그룹이 삭제되었습니다.");
    }

    // 6. 테이블 삭제 (Soft Delete)
    @DeleteMapping("/{tableId}")
    public ResponseEntity<String> deleteTable(@PathVariable Long tableId,
                                              @RequestParam Long userId) {
        tableService.removeTable(tableId, userId);
        return ResponseEntity.ok("테이블이 삭제되었습니다.");
    }
}