package com.unki11.bestorder.table.controller;

import com.unki11.bestorder.table.domain.TableQrCode;
import com.unki11.bestorder.table.service.TableQrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qrcode")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TableQrCodeController {

    private final TableQrCodeService tableQrCodeService;

    // 1. 한 매장의 모든 테이블 QR코드 목록 조회
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<TableQrCode>> getAllQrCodes(@PathVariable Long storeId) {
        return ResponseEntity.ok(tableQrCodeService.getStoreQrCodes(storeId));
    }

    // 2. 특정 테이블의 QR코드 조회
    @GetMapping("/store/{storeId}/table/{tableId}")
    public ResponseEntity<String> getQrCode(
            @PathVariable Long storeId,
            @PathVariable Long tableId) {
        TableQrCode tableQrCode = tableQrCodeService.getTableQrCode(storeId, tableId);
        String qrCode = tableQrCodeService.generateQrCodeImage(tableQrCode.getQrUrl());

        return ResponseEntity.ok(qrCode);
    }

    // 3. QR코드 등록 (신규 발급)
    @PostMapping
    public ResponseEntity<String> createQrCode(@RequestBody TableQrCode tableQrCode) {
        //tableQrCodeService.generateTableQrCode(tableQrCode);
        return ResponseEntity.ok("QR코드가 성공적으로 발급되었습니다.");
    }

    // 4. QR코드 상태 변경 (ACTIVE, REVOKED 등)
    @PatchMapping("/{qrId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long qrId,
            @RequestParam Long storeId,
            @RequestParam Long tableId,
            @RequestParam String status,
            @RequestParam Long userId) {
        tableQrCodeService.changeQrCodeStatus(storeId, tableId, qrId, status, userId);
        return ResponseEntity.ok("QR코드 상태가 변경되었습니다.");
    }
}