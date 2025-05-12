package com.dolearndorun.workerheal_app.member.reservated.cancel;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member/reservated/cancel")
@Slf4j
public class ReservationCancelController {

    private final ReservationCancelService reservationCancelService;

    @DeleteMapping("/{reservationNo}")
    public ResponseEntity<?> cancelReservation(@PathVariable String reservationNo) {
        log.info("예약 취소 요청을 받은 예약번호: {}", reservationNo);
        try {
            reservationCancelService.cancelReservation(reservationNo);
            return ResponseEntity.status(HttpStatus.OK).body("예약 취소 완료");
        } catch (Exception e) {
            log.error("예약 취소 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예약 취소 실패");
        }
    }
}
