package com.unki11.bestorder.store.repository;

import com.unki11.bestorder.auth.domain.User;
import com.unki11.bestorder.store.domain.Store;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface StoreRepository {

    void insertStore(Store store);
    int updateStore(Store store);
    Store selectStoreById(Long storeId);

}