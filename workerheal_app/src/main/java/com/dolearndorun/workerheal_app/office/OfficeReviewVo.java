package com.dolearndorun.workerheal_app.office;

import lombok.Data;

@Data
public class OfficeReviewVo {

    private String reviewNo;
    private String memberNo;
    private String reservateNo;
    private String officeNo;
    private String content;
    private String score;
    private String enrollDate;
    private String modifyDate;
    private String delYn;

    private String reviewAttachmentNo;
    private String reviewAttachmentOriginalName;
    private String reviewAttachmentSavedName;
    private String reviewAttachmentPath;
}
