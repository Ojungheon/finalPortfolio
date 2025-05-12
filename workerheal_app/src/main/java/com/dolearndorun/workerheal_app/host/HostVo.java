package com.dolearndorun.workerheal_app.host;

import com.dolearndorun.workerheal_app.lodging.LodgingVo;
import com.dolearndorun.workerheal_app.office.OfficeVo;
import lombok.Data;

import java.util.List;

@Data
public class HostVo {
    private Long no;
    private String id;
    private String pw;
    private String name;
    private String phone;
    private String isLock;
    private Long attemptNum;
    private String enrollDate;
    private String delYn;

    private int businessCount; // 사업장 수 추가
}
