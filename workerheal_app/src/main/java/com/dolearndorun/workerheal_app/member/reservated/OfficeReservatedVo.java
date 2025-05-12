package com.dolearndorun.workerheal_app.member.reservated;

import lombok.Data;

@Data
public class OfficeReservatedVo {
    // RESERVATION_OFFICE 테이블 컬럼
    private String reservationNo;  // 예약번호
    private Long memberNo;         // 회원 번호
    private String memberName;
    private String reservateStatus; // 예약 상태 코드
    private Long officeNo;         // 오피스 번호
    private Long reservateNum;     // 예약 인원
    private Long price;            // 가격
    private String extraCode;      // 추가 코드
    private String startDate;      // 이용 시작 날짜
    private String endDate;        // 이용 종료 날짜
    private String reservateDate;  // 예약 날짜
    private String isPackage;      // 패키지 여부 ('Y' or 'N')

    // OFFICE 테이블 컬럼
    private Long hostNo;           // 호스트 번호
    private Long regionNo;         // 지역 번호
    private String region;
    private String businessNo;     // 사업자 번호
    private String name;           // 오피스 이름
    private String phone;          // 연락처
    private String detail;         // 상세 설명
    private Long officePrice;      // 오피스 기본 가격
    private Long capacity;         // 수용 가능 인원
    private String open;           // 영업 시작 시간
    private String close;          // 영업 종료 시간
    private String facilitieCode;  // 시설 코드
    private String officeExtraCode;// 오피스 추가 코드
    private String tag;            // 태그
    private Double score;          // 평점
    private String postcode;       // 우편번호
    private String roadAddress;    // 도로명 주소
    private String detailAddress;  // 상세 주소
    private String enrollDate;     // 등록일
    private String modifyDate;     // 수정일
    private String delYn;          // 삭제 여부
}
