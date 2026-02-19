package com.unki11.bestorder.store.controller;

import com.unki11.bestorder.auth.dto.request.LoginRequest;
import com.unki11.bestorder.auth.dto.request.UserJoinRequest;
import com.unki11.bestorder.auth.dto.response.LoginResponse;
import com.unki11.bestorder.auth.service.AuthService;
import com.unki11.bestorder.common.error.Enum.ErrorCode;
import com.unki11.bestorder.common.error.exception.BusinessException;
import com.unki11.bestorder.store.domain.Store;
import com.unki11.bestorder.store.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 프론트엔드 연동용
public class StroeController {

    private final StoreService storeService;

    // 매장 등록
    @PostMapping
    public ResponseEntity<String> registerStore(@RequestBody Store store) {
        storeService.registerStore(store);
        return ResponseEntity.ok("매장이 성공적으로 등록되었습니다.");
    }

    // 매장 상세 조회
    @GetMapping("/{storeId}")
    public ResponseEntity<Store> getStoreDetail(@PathVariable Long storeId) {
        Store store = storeService.getStoreDetail(storeId);
        return ResponseEntity.ok(store);
    }

    // 매장 정보 수정
    @PutMapping("/{storeId}")
    public ResponseEntity<String> modifyStore(@PathVariable Long storeId, @RequestBody Store store) {
        store.setStoreId(storeId);
        storeService.modifyStore(store);
        return ResponseEntity.ok("매장 정보가 수정되었습니다.");
    }
}