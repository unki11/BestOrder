package com.unki11.bestorder.table.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.unki11.bestorder.table.domain.TableQrCode;
import com.unki11.bestorder.table.repository.TableQrCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TableQrCodeService {

    private final TableQrCodeRepository tableQrCodeRepository;

    // 실제 운영 시에는 도메인 주소로 변경해야 합니다.
    private static final String BASE_URL = "http://localhost:8080/order/t/";

    // 1. 매장별 전체 QR코드 조회
    public List<TableQrCode> getStoreQrCodes(Long storeId) {
        return tableQrCodeRepository.selectAllQrCodesByStoreId(storeId);
    }

    // 2. 특정 테이블의 QR코드 단건 조회
    public TableQrCode getTableQrCode(Long storeId, Long tableId) {
        return tableQrCodeRepository.selectQrCodeByStoreAndTable(storeId, tableId);
    }

    // 2. 특정 테이블의 QR코드 단건 조회
    public TableQrCode getTableQrCodeToeken(String qrToken) {
        return tableQrCodeRepository.selectQrCodeByStoreAndToken(qrToken);
    }

    // 3. QR코드 신규 발급 및 저장
    @Transactional
    public String generateTableQrCode(TableQrCode tableQrCode) {

        try {
            // 1. 고유 UUID 생성
            String tableUuid = UUID.randomUUID().toString().replace("-", "").substring(0, 10);

            // 2. DB에 테이블 정보 및 UUID 저장
            tableQrCode.setQrToken(tableUuid);

            // 3. QR 코드에 담을 URL 조합
            String orderUrl = BASE_URL + tableUuid;

            // 4. ZXing으로 QR 코드 비트맵 생성 (200x200 사이즈)
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(orderUrl, BarcodeFormat.QR_CODE, 200, 200);

            // 5. 비트맵을 PNG 이미지 바이트 배열로 변환
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] qrImageBytes = outputStream.toByteArray();

            tableQrCode.setQrUrl(orderUrl);

            tableQrCodeRepository.insertTableQrCode(tableQrCode);

            // 6. React <img src="..."> 에 바로 넣을 수 있도록 Base64 인코딩
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(qrImageBytes);

        } catch (Exception e) {

            throw new RuntimeException("QR 생성 실패");
        }
    }

    // 4. QR코드 상태 변경 (예: 재발급 시 기존 QR 폐기 처리)
    @Transactional
    public void changeQrCodeStatus(Long storeId, Long tableId, Long qrId, String status, Long userId) {
        TableQrCode qrCodeUpdateDto = TableQrCode.builder()
                .storeId(storeId)
                .tableId(tableId)
                .qrId(qrId)
                .status(status)
                .updatedUser(userId)
                .build();

        tableQrCodeRepository.updateTableQrCodeStatus(qrCodeUpdateDto);
    }

    public String generateQrCodeImage(String url) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            // 가로 200, 세로 200 픽셀 사이즈의 QR 코드 생성
            BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, 200, 200);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            // 비트 매트릭스를 PNG 포맷의 스트림으로 변환
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            // React <img src="..."> 에 바로 넣을 수 있도록 포맷팅하여 반환
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(outputStream.toByteArray());

        } catch (IOException | WriterException e) {
            throw new RuntimeException("QR 코드 이미지 생성 중 오류가 발생했습니다. URL: " + url, e);
        }
    }
}