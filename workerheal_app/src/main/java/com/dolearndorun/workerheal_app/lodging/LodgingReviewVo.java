package com.dolearndorun.workerheal_app.lodging;

import lombok.Data;

@Data
public class LodgingReviewVo {
   private Long no;
   private String memberNo;
   private String reservateNo;
    private String lodgingNo;
    private String content;
    private String score;
    private String enrollDate;
    private String modifyDate;
    private String delYn;

    private String memberName;
}
