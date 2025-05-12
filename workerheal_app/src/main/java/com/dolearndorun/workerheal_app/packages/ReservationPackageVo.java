package com.dolearndorun.workerheal_app.packages;

import lombok.Data;

@Data
public class ReservationPackageVo {

    private String reservationNo;
    private int memberNo;
    private String officeReservateNo;
    private String lodgingReservateNo;
    private String tourReservateNo;
    private String packageNo;
    private String reservateStatus;
    private int reservateNum;
    private String price;
    private String startDate;
    private String endDate;
    private String reservateDate;
}
