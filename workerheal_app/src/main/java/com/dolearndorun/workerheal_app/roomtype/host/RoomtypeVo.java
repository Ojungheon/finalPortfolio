package com.dolearndorun.workerheal_app.roomtype.host;

import lombok.Data;

@Data
public class RoomtypeVo {

    private Long no;
    private Long lodgingNo;
    private String name;
    private String price;
    private String sleeps;
    private String sleepMax;
    private String singleBed;
    private String doubleBed;
    private String facilitieCode;
    private String amount;
    private String checkIn;
    private String checkOut;
    private String enrollDate;
    private String modifyDate;
    private String delYn;
}
