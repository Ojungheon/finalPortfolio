package com.dolearndorun.workerheal_app.lodging;

import lombok.Data;

@Data
public class LodgingRoomTypeAttachVo {
    private Long no;
//    private String lodgingNo;
    private String roomTypeNo; // 태훈 수정
    private String originName;
    private String changeName;
    private String path;
    private String orderNo;
    private String uploadDate;
    private String delYn;

}
