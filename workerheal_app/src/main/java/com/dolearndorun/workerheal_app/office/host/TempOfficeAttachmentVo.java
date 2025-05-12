package com.dolearndorun.workerheal_app.office.host;

import lombok.Data;

@Data
public class TempOfficeAttachmentVo {

    private Long no;
    private Long officeNo;
    private String originName;
    private String changeName;
    private String path;
    private int orderNo;
    private String uploadDate;
    private String delYn;
}
