package com.dolearndorun.workerheal_app.roomtype.host;

import lombok.Data;

@Data
public class TempRoomtypeAttachmentVo {

    private Long no;
    private Long roomTypeNo;
    private String originName;
    private String changeName;
    private String path;
    private int orderNo;
    private String uploadDate;
    private String delYn;
}
