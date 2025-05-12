package com.dolearndorun.workerheal_app.roomtype.host;

import lombok.Data;

@Data
public class TempRoomtypeVo {

    private Long no;
    private Long roomTypeNo;
    private int lodgingNo;
    private Long statusNo;
    private String name;
    private String price;
    private String sleeps;
    private String singleBed;
    private String doubleBed;
    private String facilitieCode;
    private String amount;
    private String checkIn;
    private String checkOut;
    private String createDate;
}
