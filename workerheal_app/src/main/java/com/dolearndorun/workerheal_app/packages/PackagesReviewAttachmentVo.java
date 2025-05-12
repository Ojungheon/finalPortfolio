package com.dolearndorun.workerheal_app.packages;

import lombok.Data;

@Data
public class PackagesReviewAttachmentVo {
    private Long no;
    private int reviewNo;
    private String originName;
    private String changeName;
    private String path;
    private String orderNo;
    private String uploadDate;
    private String delYn;
}
