package com.dolearndorun.workerheal_app.packages;

import lombok.Data;

@Data
public class ReservationOfficeVo {

    private String reservationNo;
//    private String memberNo;
    private Long memberNo; // 태훈 수정
    private String reservateStatus;
    private String officeNo;
    private String reservateNum;
    private String price;
    private String extraCode;
    private String startDate;
    private String endDate;
    private String reservateDate;
    private String isPackage;

//    faciliteExtra
    private Long no;
    private String officeReservateNo;
    private String faciliteCode;
    private String amount;
}
