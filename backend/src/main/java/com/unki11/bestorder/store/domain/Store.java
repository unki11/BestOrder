package com.unki11.bestorder.store.domain;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {
    private Long storeId;
    private Long ownerId;
    private String storeName;
    private String zipCode;
    private String address;
    private String phone;
    private String description;
    private String businessHours;
    private Boolean isOpen;
    private String useYn;

    // 감사(Audit) 필드
    private LocalDateTime createdAt;
    private Long createdUser;
    private LocalDateTime updatedAt;
    private Long updatedUser;
}