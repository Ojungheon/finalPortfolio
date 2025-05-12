package com.dolearndorun.workerheal_app.payment;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaymentMapper {

    // 결제정보 등록
    @Insert("""
            INSERT INTO PAYMENT
            (
                NO
                , MEMBER_NO
                , RESERVATION_NO
                , PRICE
                , PAY_DATE
                , PAY_TYPE
            )
            VALUES
            (
                SEQ_PAYMENT.NEXTVAL
                , #{memberNo}
                , #{reservationNo}
                , #{price}
                , SYSDATE
                , #{payType}
            )
            """)
    int enrollPayInfo(PaymentVo vo);

    // 예약번호 생성항 시퀀스 가져오기
    String getCurrentSeq(String type);

}//class
