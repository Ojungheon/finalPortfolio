package com.dolearndorun.workerheal_app.member;

import lombok.Data;

@Data
public class PasswordChangeRequest2 {
    private String id; // 사용자 ID
    private String newPassword; // 새로운 비밀번호
}
