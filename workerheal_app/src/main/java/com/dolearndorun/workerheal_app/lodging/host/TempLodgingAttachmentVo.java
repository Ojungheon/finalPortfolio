package com.dolearndorun.workerheal_app.lodging.host;

import lombok.Data;

@Data
public class TempLodgingAttachmentVo {

    private Long no;
    private Long lodgingNo;
    private String originName;
    private String changeName;
    private String path;
    private int orderNo;
    private String uploadDate;
    private String delYn;
}
