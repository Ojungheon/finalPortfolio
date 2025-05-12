package com.dolearndorun.workerheal_app.member;

import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String id; // 사용자 ID
    private String currentPassword; // 현재 비밀번호
    private String newPassword; // 새로운 비밀번호
    private String confirmPassword; // 비밀번호 확인
}
