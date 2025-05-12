package com.dolearndorun.workerheal_app.member;

import com.dolearndorun.workerheal_app.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final BCryptPasswordEncoder encoder;
    private final MemberMapper memberMapper;
    private final JwtUtil jwtUtil;

    public void join(MemberVo vo) {
        String encodedPw = encoder.encode(vo.getPw());
        vo.setPw(encodedPw);
        memberMapper.join(vo);
    }

    public String login(MemberVo vo){
        MemberVo dbVo = findUserById(vo.getId());
        boolean isMatch = encoder.matches(vo.getPw(), dbVo.getPw());

        if (!isMatch) {
            throw new IllegalStateException("로그인 실패");
        }

        return jwtUtil.createJwtToken(
                dbVo.getNo(),
                dbVo.getId(),
                dbVo.getName(),
                dbVo.getNick(),
                "ROLE_MEMBER",
                dbVo.getPhone(),
                String.valueOf(dbVo.getJobNo()),
                dbVo.getCompany(),
                dbVo.getEnrollDate(),
                dbVo.getPoint()
        );
    }

    public MemberVo findUserById(String id) {
        return memberMapper.findUserById(id);
    }

    // ✅ 회원 정보 수정 메서드 추가
    public void updateMember(MemberVo vo) {
        memberMapper.updateMember(vo);
    }

    // 비밀번호 변경 메서드

    public void changePassword(PasswordChangeRequest request) {
        MemberVo dbVo = findUserById(request.getId());
        System.out.println("dbVo = " + dbVo);

        // ✅ 1. 현재 비밀번호 검증 (BCryptPasswordEncoder 사용)
        boolean isMatch = encoder.matches(request.getCurrentPassword(), dbVo.getPw());
        System.out.println("isMatch = " + isMatch);
        if (!isMatch) {
            throw new IllegalStateException("현재 비밀번호가 일치하지 않습니다.");
        }

        // ✅ 2. 새 비밀번호와 확인 비밀번호 비교
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalStateException("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        // ✅ 3. 새 비밀번호 암호화 후 저장
        String encodedNewPassword = encoder.encode(request.getNewPassword());
        memberMapper.changePassword(request.getId(), encodedNewPassword);
    }
    //현재비밀번호 검증
    public boolean verifyPassword(String id, String currentPassword) {
        MemberVo dbVo = memberMapper.findUserById(id);

        if (dbVo == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }

        return encoder.matches(currentPassword, dbVo.getPw()); // 현재 비밀번호 검증
    }

    //회원탈퇴
    public int deleteMember(String userId) {
        return memberMapper.updateDelYn(userId); // ✅ 변경된 행 개수 반환
    }




    //아이디 찾기
    public MemberVo findMemberByNameAndPhone(String name, String phone) {
        return memberMapper.findMemberByNameAndPhone(name, phone);
    }

    // ✅ 사용자가 입력한 정보가 맞는지 검증
    public boolean validateMemberForPasswordReset(String id, String name, String phone) {
        return memberMapper.findMemberByIdNamePhone(id, name, phone) != null;
    }

    // 🔥 비밀번호 변경 로직
    public void updatePassword(String id, String newPassword) {
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }

        // ✅ 해당 ID의 계정이 존재하는지 확인
        MemberVo member = memberMapper.findUserById(id);
        if (member == null) {
            throw new IllegalArgumentException("해당 계정이 존재하지 않습니다.");
        }

        // ✅ 새 비밀번호를 암호화하여 저장
        String encryptedPassword = encoder.encode(newPassword);
        memberMapper.updatePassword(id, encryptedPassword);
    }


}
