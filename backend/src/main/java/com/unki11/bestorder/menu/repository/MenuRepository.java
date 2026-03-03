package com.unki11.bestorder.menu.repository;

import com.unki11.bestorder.menu.domain.Menu;
import com.unki11.bestorder.menu.domain.MenuGrp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MenuRepository {

    /**
     * 상점 ID로 메뉴 그룹 및 하위 메뉴 전체 조회 (계층 구조)
     * MyBatis의 resultMap(MenuGrpMap)을 사용하여 1:N 구조로 반환
     */
    List<MenuGrp> selectMenuListByStoreIdWithGrp(Long storeId);

    /**
     * 단건 조회
     */
    MenuGrp selectMenuGrpById(Long menuGrpId);
    Menu selectMenuById(Long menuId);

    /**
     * 메뉴 그룹 Upsert (Insert or Update)
     */
    int upsertMenuGrp(MenuGrp menuGrp);

    /**
     * 메뉴 상세 Upsert (Insert or Update)
     */
    int upsertMenu(Menu menu);

    /**
     * 메뉴 판매 가능 상태 변경 (품절 처리 등)
     */
    int updateMenuAvailability(@Param("menuId") Long menuId,
                               @Param("isAvailable") Integer isAvailable,
                               @Param("updatedUser") Long updatedUser);

    /**
     * 메뉴 그룹 삭제
     */
    int deleteMenuGrp(@Param("menuGrpId") Long menuGrpId,
                      @Param("updatedUser") Long updatedUser);

    /**
     * 메뉴 상세 삭제
     */
    int deleteMenu(@Param("menuId") Long menuId,
                   @Param("updatedUser") Long updatedUser);
}