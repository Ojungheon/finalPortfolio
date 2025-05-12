package com.dolearndorun.workerheal_app.packages;

import lombok.Data;

@Data
public class ReservationTourVo {

    private String reservationNo;
    private String memberNo;
    private String memberName;
    private String tourNo;
    private String reservateStatus;
    private int reservateNum;
    private String price;
    private String startDate;
    private String endDate;
    private String reservateDate;
}
