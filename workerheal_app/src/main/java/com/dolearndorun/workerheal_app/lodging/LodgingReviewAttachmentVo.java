package com.dolearndorun.workerheal_app.lodging;

import lombok.Data;

@Data
public class LodgingReviewAttachmentVo {
    private Long no;
    private String reviewNo;
    private String originName;
    private String changeName;
    private String path;
    private String orderNo;
    private String uploadDate;
    private String delYn;
}
