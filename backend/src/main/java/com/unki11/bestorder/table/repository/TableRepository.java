package com.unki11.bestorder.table.repository;

import com.unki11.bestorder.table.domain.Table;
import com.unki11.bestorder.table.domain.TableGrp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface TableRepository {
    // 조회
    List<TableGrp> selectTableListByStoreIdWithGrp(Long storeId);

    // Upsert (Insert or Update)
    int upsertTableGrp(TableGrp tableGrp);
    int upsertTable(Table table);

    // 상태 변경 및 삭제
    int updateTableStatus(@Param("tableId") Long tableId,
                          @Param("status") String status,
                          @Param("updatedUser") Long updatedUser);

    int deleteTableGrp(@Param("tableGrpId") Long tableGrpId,
                       @Param("updatedUser") Long updatedUser);

    int deleteTable(@Param("tableId") Long tableId,
                    @Param("updatedUser") Long updatedUser);
}