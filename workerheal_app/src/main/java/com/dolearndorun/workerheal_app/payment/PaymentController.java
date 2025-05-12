package com.dolearndorun.workerheal_app.payment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("api/pay")
public class PaymentController {

    private final PaymentService service;

    // 예약번호 생성
    @GetMapping("reserveNo/{type}")
//    public ResponseEntity<Map<String,Object>>  setReservationNo(@PathVariable("type") String type){
    public ResponseEntity<String >  setReservationNo(@PathVariable("type") String type){
        try {
            return ResponseEntity.ok(service.setReservationNo(type));
        } catch (Exception e) {
            System.out.println("e = " + e);
            log.error("예약번호 생성 오류 :: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","예약번호 생성 중 오류 발생") );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예약번호 생성 중 오류 발생");
        }
    }//setReservationNo

}//class
