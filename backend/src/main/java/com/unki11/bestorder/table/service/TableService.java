package com.unki11.bestorder.table.service;

import com.unki11.bestorder.table.domain.Table;
import com.unki11.bestorder.table.domain.TableGrp;
import com.unki11.bestorder.table.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TableService {

    private final TableRepository tableRepository;

    // 매장별 전체 레이아웃(그룹+테이블) 조회
    public List<TableGrp> getTableLayout(Long storeId) {
        return tableRepository.selectTableListByStoreIdWithGrp(storeId);
    }

    // 그룹 저장/수정
    @Transactional
    public void saveTableGrp(TableGrp tableGrp) {
        tableRepository.upsertTableGrp(tableGrp);
    }

    // 테이블 저장/수정
    @Transactional
    public void saveTable(Table table) {
        tableRepository.upsertTable(table);
    }

    // 상태만 변경 (예: 입장, 퇴장)
    @Transactional
    public void changeTableStatus(Long tableId, String status, Long userId) {
        tableRepository.updateTableStatus(tableId, status, userId);
    }

    // 삭제 (Soft Delete)
    @Transactional
    public void removeTableGrp(Long tableGrpId, Long userId) {
        tableRepository.deleteTableGrp(tableGrpId, userId);
    }

    @Transactional
    public void removeTable(Long tableId, Long userId) {
        tableRepository.deleteTable(tableId, userId);
    }
}