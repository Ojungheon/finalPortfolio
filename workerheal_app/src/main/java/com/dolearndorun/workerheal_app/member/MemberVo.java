package com.dolearndorun.workerheal_app.member;

import lombok.Data;

@Data
public class MemberVo {
    private Long no;            // 회원 번호 (PK)
    private Long jobNo;         // 직업 번호 (FK)
    private String id;          // 아이디
    private String pw;          // 비밀번호
    private String name;        // 이름
    private String nick;        // 닉네임
    private String phone;       // 연락처 (11자리)
    private String company;     // 회사명 (선택 입력)
    private Long point;         // 포인트 (기본값 0)
    private String enrollDate;    // 가입일 (SYSDATE)
    private String modifyDate;    // 정보 수정일 (NULL 가능)
    private String isLock;        // 계정 잠금 여부 ('N' 기본값)
    private Long attemptNum;     // 로그인 실패 횟수 (기본값 0)
    private String delYn;         // 탈퇴 여부 ('N' 기본값)
}
