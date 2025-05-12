package com.dolearndorun.workerheal_app.lodging;

import lombok.Data;

@Data
public class LodgingVo {

    private Long no;
    private Long hostNo;
    private Long regionNo;
    private int typeNo;
    private String businessNo;
    private String name;
    private String phone;
    private String facilitieCode;
    private String tag;
    private String score;
    private String postcode;
    private String roadAddress;
    private String detailAddress;
    private String enrollDate;
    private String modifyDate;
    private String delYn;

    private String hostName;

    private String detail;
    private String checkIn;
    private String checkOut;
    private String roomName;  // 룸 이름
    private int roomPrice;    // 룸 가격
    private int roomAmount;   // 룸 수량

    private String lowestPrice;
    private String averageScore;
    private String count;
    private String path;

    private int sleeps; // 태훈 수정
    private String regionName; // 태훈 수정
    private String typeName; // 태훈 수정
}
