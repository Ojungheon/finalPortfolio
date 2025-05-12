package com.dolearndorun.workerheal_app.member.saved;

import lombok.Data;

@Data
public class SavedVo {
    private Long no;
    private String name;         // 이름
    private Long score;        // 평점
    private String region;       // 지역
    private String tag;          // 태그
    private String imagePath;    // 대표사진 경로
    private String productType;  // 상품 타입 (숙소, 오피스, 패키지)
}
