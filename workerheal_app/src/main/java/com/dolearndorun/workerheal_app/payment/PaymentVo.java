package com.dolearndorun.workerheal_app.payment;

import lombok.Data;

@Data
public class PaymentVo {

    private Long no;
    private Long memberNo;
    private String reservationNo;
    private int price;
    private String payDate;
    private String payType;

}
