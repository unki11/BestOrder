package com.unki11.bestorder.repository;

import com.unki11.bestorder.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.Optional;

@Mapper
public interface UserRepository {
    // 이메일로 사용자 찾기
    Optional<User> findByEmail(@Param("email") String email);

    // 사용자 생성
    void insert(User user);

    // ID로 사용자 찾기
    Optional<User> findById(@Param("userId") Long userId);
}