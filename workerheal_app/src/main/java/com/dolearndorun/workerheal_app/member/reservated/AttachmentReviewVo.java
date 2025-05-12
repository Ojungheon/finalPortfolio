package com.dolearndorun.workerheal_app.member.reservated;

import lombok.Data;

@Data
public class AttachmentReviewVo {

    private Long no;
    private Long reviewNo;
    private String originName;
    private String changeName;
    private String path;
    private Long orderNo;
    private String uploadDate;
    private String delYn;
}
