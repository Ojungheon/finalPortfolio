package com.dolearndorun.workerheal_app.member.reservated;

import lombok.Data;

@Data
public class PackageReservatedVo {
    private String packageName;      // 패키지 이름
    private String detail;           // 패키지 상세 설명
    private String tag;              // 패키지 태그
    private String packageStart;     // 패키지 이용 시작일
    private String packageEnd;       // 패키지 이용 종료일
    private Long packagePrice;       // 패키지 가격
    private String reservationNo;       // 패키지 예약번호 - 태훈 추가

    // 오피스 정보
    private String officeName;
    private String officePhone;
    private String officeAddress1;
    private String officeAddress2;
    private String officeAddress3;
    private String officeFacilitie;
    private String officeStart;
    private String officeEnd;
    private String officeReservationNo; // 태훈 추가

    // 숙소 정보
    private String lodgingName;
    private String lodgingPhone;
    private String lodgingAddress1;
    private String lodgingAddress2;
    private String lodgingAddress3;
    private String lodgingFacilitie;
    private String lodgingStart;
    private String lodgingEnd;

    // 관광지 정보
    private String tourSpotName;
    private String tourSpotAddress;
    private String tourSpotDetailAddress;
    private String tourStart; // 관광상품 이용 시작일 - 태훈 추가
    private String tourEnd; // 관광상품 이용 종료일 - 태훈 추가
    private int amount; // 관광상품 이용자 수 - 태훈 추가
    
}
