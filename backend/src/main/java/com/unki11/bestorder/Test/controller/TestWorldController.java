package com.unki11.bestorder.Test.controller;

import com.unki11.bestorder.auth.domain.User;
import com.unki11.bestorder.auth.dto.request.LoginRequest;
import com.unki11.bestorder.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TestWorldController {

    @GetMapping("/hello")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "백엔드에서 보낸 메시지입니다!");
        response.put("status", "success");

        return response;
    }
}
