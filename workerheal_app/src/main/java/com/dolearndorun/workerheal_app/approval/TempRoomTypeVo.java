package com.dolearndorun.workerheal_app.approval;

import lombok.Data;

@Data
public class TempRoomTypeVo {

    private Long no;
    private Long roomTypeNo;
    private Long lodgingNo;
    private String statusNo;
    private String name;
    private String price;
    private int sleeps;
    private int amount;
    private String facilitieCode;
    private int singleBed;
    private int doubleBed;
    private String checkIn;
    private String checkOut;
    private String createDate;

}
