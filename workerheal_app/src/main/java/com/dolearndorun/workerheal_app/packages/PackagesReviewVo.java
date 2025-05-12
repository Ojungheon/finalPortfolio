package com.dolearndorun.workerheal_app.packages;

import lombok.Data;

@Data
public class PackagesReviewVo {
    private Long no;
    private String memberNo;
    private String reservateNo;
    private String packageNo;
    private String content;
    private String score;
    private String enrollDate;
    private String modifyDate;
    private String delYn;

}
