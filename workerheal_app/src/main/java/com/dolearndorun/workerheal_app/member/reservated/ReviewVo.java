package com.dolearndorun.workerheal_app.member.reservated;

import lombok.Data;

@Data
public class ReviewVo {
    private Long no;
    private Long memberNo;      // 회원 번호
    private String reservationNo; // 예약 번호
    private String productType;
    private Long reviewNo; //office? lodging? package?
    private String content;      // 리뷰 내용
    private Long score;       // 평점
    private String enrollDate;
    private String modifyDate;
    private String delYn;
    private String path;
}
