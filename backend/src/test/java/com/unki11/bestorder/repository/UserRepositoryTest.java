package com.unki11.bestorder.repository;

import com.unki11.bestorder.auth.domain.User;
import com.unki11.bestorder.auth.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@SpringBootTest
@ActiveProfiles("dev")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void proxyTest() {
        log.info("ABC 안녕: " + userRepository.getClass().getName());
    }

    @Test
    void xmlPathTest() {
        // MyBatis가 XML 파일을 실제로 찾을 수 있는지 위치를 찍어봅니다.
        log.info("XML 위치 확인: " + getClass().getClassLoader().getResource("mapper/UserMapper.xml"));
    }
    @Test
    void findByEmail_Test() {
        // Given
        String email = "admin@bestorder.com";

        // When
        Optional<User> user = userRepository.findByEmail(email);

        // Then
        assertThat(user).isPresent();
        assertThat(user.get().getName()).isEqualTo("관리자");
        assertThat(user.get().getRole()).isEqualTo("OWNER");
    }
}