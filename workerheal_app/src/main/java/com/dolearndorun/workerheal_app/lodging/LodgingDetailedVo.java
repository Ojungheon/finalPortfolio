package com.dolearndorun.workerheal_app.lodging;

import lombok.Data;

@Data
public class LodgingDetailedVo {

    // 숙소 기본정보
    private Long no;
    private String name;
    private String phone;
    private String regionNo;
    private String facilitieCode;
    private String tag;
    private String score;
    private String postcode;
    private String roadAddress;
    private String detailAddress;
    private int price;
//    private String facilitieName;

    // 숙소 유형 정보
    private String lodgingTypeName;
    private String detail; // 태훈 추가
    private String regionName; // 태훈 추가

}
