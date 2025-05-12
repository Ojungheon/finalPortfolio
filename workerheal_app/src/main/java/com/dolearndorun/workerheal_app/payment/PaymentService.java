package com.dolearndorun.workerheal_app.payment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PaymentService {

    private final PaymentMapper mapper;

    // 결제정보 등록
    public int enrollPayInfo(PaymentVo vo){
        return mapper.enrollPayInfo(vo);
    }//enrollPayInfo

    // 예약번호 생성
    public String setReservationNo(String type) {
       return mapper.getCurrentSeq(type);
    }//setReservationNo

}//class
