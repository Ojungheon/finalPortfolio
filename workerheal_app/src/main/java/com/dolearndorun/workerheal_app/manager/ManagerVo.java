package com.dolearndorun.workerheal_app.manager;

import lombok.Data;

@Data
public class ManagerVo {
    private Long no;
    private String id;
    private String pw;
    private String name;
    private String phone;
    private String enrollData;
    private String isLock;
    private Long attemptNum;
    private String delYn;

}
