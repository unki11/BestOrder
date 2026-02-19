package com.unki11.bestorder.store.service;

import com.unki11.bestorder.auth.domain.User;
import com.unki11.bestorder.auth.dto.request.LoginRequest;
import com.unki11.bestorder.auth.dto.request.UserJoinRequest;
import com.unki11.bestorder.auth.dto.response.LoginResponse;
import com.unki11.bestorder.auth.repository.UserRepository;
import com.unki11.bestorder.common.error.Enum.ErrorCode;
import com.unki11.bestorder.common.error.exception.BusinessException;
import com.unki11.bestorder.store.domain.Store;
import com.unki11.bestorder.store.repository.StoreRepository;
import com.unki11.bestorder.util.JwtProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository soreRepository;

    @Transactional
    public void registerStore(Store store) {
        // 기본값 세팅 및 비즈니스 로직 검증 가능
        store.setUseYn("Y");
        soreRepository.insertStore(store);
    }

    @Transactional
    public void modifyStore(Store store) {
        int result = soreRepository.updateStore(store);
        if (result == 0) {
            throw new BusinessException(ErrorCode.STORE_NOT_FOUND);
        }
    }

    public Store getStoreDetail(Long storeId) {
        Store store = soreRepository.selectStoreById(storeId);
        if (store == null || "N".equals(store.getUseYn())) {
            throw new BusinessException(ErrorCode.STORE_NOT_FOUND);
        }
        return store;
    }
}