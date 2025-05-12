package com.dolearndorun.workerheal_app.lodging;

import lombok.Data;

@Data
public class LodgingRoomTypeVo {
    private Long no;
    private String lodgingNo;
    private String name;
    private String price;
    private String sleeps;
    private String sleepsMax;
    private String facilitieCode;
    private String amount;
    private String checkIn;
    private String checkOut;
    private String delYn;

//    private String bedOptionNo;
//    private String bedOptionName;
//    private String bedOptionAmount;
    
    private int singleBed; // 태훈 수정
    private int doubleBed; // 태훈 수정
}
