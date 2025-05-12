package com.dolearndorun.workerheal_app.member.reservated;

import lombok.Data;

@Data
public class ReservatedVo {
    private String reservationNo; // 예약번호
    private String name;          // 상품명
    private String status;        //상태코드
    private String region;       // 지역
    private Long reservateNum;   // 신청인원
    private Long price;           // 가격
    private String imagePath;     // 대표사진 경로
    private String startDate;    // 이용 시작 날짜
    private String endDate;      // 이용 종료 날짜
    private String productType;  // 상품 타입 (숙소, 오피스, 패키지)
    private String memberName;          // 맴버 번호(두수 추가)
}
