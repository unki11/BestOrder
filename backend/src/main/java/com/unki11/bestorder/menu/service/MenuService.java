package com.unki11.bestorder.menu.service;

import com.unki11.bestorder.menu.domain.Menu;
import com.unki11.bestorder.menu.domain.MenuGrp;
import com.unki11.bestorder.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    /**
     * 매장별 전체 메뉴판(그룹 + 메뉴) 조회
     * 계층 구조(1:N)로 반환됩니다.
     */
    public List<MenuGrp> getMenuLayout(Long storeId) {
        return menuRepository.selectMenuListByStoreIdWithGrp(storeId);
    }

    /**
     * 메뉴 그룹(카테고리) 저장 또는 수정 (Upsert)
     */
    @Transactional
    public void saveMenuGrp(MenuGrp menuGrp) {
        menuRepository.upsertMenuGrp(menuGrp);
    }

    /**
     * 메뉴 상세 정보 저장 또는 수정 (Upsert)
     */
    @Transactional
    public void saveMenu(Menu menu) {
        menuRepository.upsertMenu(menu);
    }

    /**
     * 메뉴 판매 가능 상태 변경 (예: 판매중, 품절)
     * @param menuId 대상 메뉴 ID
     * @param isAvailable 1(판매가능), 0(품절)
     * @param userId 변경을 수행한 관리자 ID
     */
    @Transactional
    public void changeMenuAvailability(Long menuId, Integer isAvailable, Long userId) {
        menuRepository.updateMenuAvailability(menuId, isAvailable, userId);
    }

    /**
     * 메뉴 그룹 삭제
     * @param menuGrpId 대상 그룹 ID
     * @param userId 삭제를 수행한 관리자 ID
     */
    @Transactional
    public void removeMenuGrp(Long menuGrpId, Long userId) {
        menuRepository.deleteMenuGrp(menuGrpId, userId);
    }

    /**
     * 메뉴 상세 삭제
     * @param menuId 대상 메뉴 ID
     * @param userId 삭제를 수행한 관리자 ID
     */
    @Transactional
    public void removeMenu(Long menuId, Long userId) {
        menuRepository.deleteMenu(menuId, userId);
    }
}