package com.unki11.bestorder.table.repository;

import com.unki11.bestorder.table.domain.TableQrCode;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface TableQrCodeRepository {

    // 1. QR코드 등록 (Insert)
    int insertTableQrCode(TableQrCode tableQrCode);

    // 2. 특정 테이블의 가장 최신 활성 QR코드 조회
    TableQrCode selectQrCodeByStoreAndTable(@Param("storeId") Long storeId,
                                            @Param("tableId") Long tableId);

    // 3. QR코드 상태 수정 (Update - 상태 변경, 폐기 등)
    int updateTableQrCodeStatus(TableQrCode tableQrCode);

    // 4. 한 매장의 모든 QR코드 조회
    List<TableQrCode> selectAllQrCodesByStoreId(@Param("storeId") Long storeId);

    // 2. 특정 테이블의 가장 최신 활성 QR코드 조회
    TableQrCode selectQrCodeByStoreAndToken(@Param("storeId") String qrToken);
}