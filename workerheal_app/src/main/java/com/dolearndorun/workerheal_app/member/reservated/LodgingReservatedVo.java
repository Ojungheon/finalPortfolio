package com.dolearndorun.workerheal_app.member.reservated;

import lombok.Data;

@Data
public class LodgingReservatedVo {
    // RESERVATION_LODGING 테이블 컬럼
    private String reservationNo;  // 예약번호
    private Long memberNo;         // 회원 번호
    private String memberName;     // 회원 이름
    private String reservateStatus; // 예약 상태 코드
    private Long lodgingNo;         // 오피스 번호
    private Long reservateNum;     // 예약 인원
    private Long price;            // 가격
    private String startDate;      // 이용 시작 날짜
    private String endDate;        // 이용 종료 날짜
    private String reservateDate;  // 예약 날짜
    private String isPackage;      // 패키지 여부 ('Y' or 'N')

    private Long bed;

    // LODGING 테이블 컬럼
    private Long hostNo;           // 호스트 번호
    private Long regionNo;         // 지역 번호
    private String region;         // 지역 이름
    private String businessNo;     // 사업자 번호
    private String name;           // 숙소 이름
    private String phone;          // 연락처
//    private String detail;         // 상세 설명
    private String facilitieCode;  // 시설 코드
    private String tag;            // 태그
    private Double score;          // 평점
    private String postcode;       // 우편번호
    private String roadAddress;    // 도로명 주소
    private String detailAddress;  // 상세 주소
    private String enrollDate;     // 등록일
    private String modifyDate;     // 수정일
    private String delYn;          // 삭제 여부

    //ROOM_TYPE
    private String roomName;         //객실이름
    private String roomFaciliteCode; //객실편의시설코드
    private String checkIn;          //입실시간
    private String checkOut;         //퇴실시간

}
