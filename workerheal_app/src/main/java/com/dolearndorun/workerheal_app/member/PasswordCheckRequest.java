package com.dolearndorun.workerheal_app.member;

import lombok.Data;

@Data
public class PasswordCheckRequest {
    private String id;
    private String currentPassword;
}
