package com.dolearndorun.workerheal_app.member;

import com.dolearndorun.workerheal_app.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("api/member")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;
    private static final ConcurrentHashMap<String, String> tokenStore = new ConcurrentHashMap<>();

    @PostMapping("join")
    public void join(@RequestBody MemberVo vo) {
        memberService.join(vo);
    }

    @PostMapping("login")
    public String login(@RequestBody MemberVo vo) {
        try {
            return memberService.login(vo);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new IllegalStateException("[MEMBER-LOGIN] LOGIN FAIL");
        }
    }

    // ✅ 개인정보 수정 API 추가
    @PutMapping("update")
    public void updateMember(@RequestBody MemberVo vo) {
        memberService.updateMember(vo);
    }

    @PutMapping("changePassword")
    public String changePassword(@RequestBody PasswordChangeRequest request) {
        try {
            memberService.changePassword(request);
            return "비밀번호 변경 성공";
        } catch (Exception e) {
            log.error("[ERROR] 비밀번호 변경 실패: " + e.getMessage());
            return "비밀번호 변경 실패";
        }
    }

    @PostMapping("verifyPassword")
    public ResponseEntity<Map<String, Boolean>> verifyPassword(@RequestBody PasswordCheckRequest request) {
        Map<String, Boolean> response = new HashMap<>();
        try {
            boolean isMatch = memberService.verifyPassword(request.getId(), request.getCurrentPassword()); // 🔥 Service를 통해 검증

            response.put("isValid", isMatch);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("비밀번호 검증 실패: " + e.getMessage());
            response.put("isValid", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("deleteAccount")
    public ResponseEntity<String> deleteAccount(@RequestBody Map<String, String> requestBody) {
        String userIdFromBody = requestBody.get("userId");

        if (userIdFromBody == null || userIdFromBody.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("🚨 유효한 userId가 필요합니다.");
        }

        int updatedRows = memberService.deleteMember(userIdFromBody); // ✅ 삭제 실행

        if (updatedRows == 0) { // ✅ 변경된 행이 없다면 (회원이 존재하지 않음)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("🚨 해당 회원을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok("✅ 회원 탈퇴 완료");
    }



    //아이디 찾기
    @PostMapping("findId")
    public ResponseEntity<String> findId(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String phone = request.get("phone");
        MemberVo member = memberService.findMemberByNameAndPhone(name, phone);

        if (member != null) {
            return ResponseEntity.ok(member.getId()); // 회원의 이메일(아이디) 반환
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("일치하는 아이디가 없습니다.");
        }
    }

    // ✅ 비밀번호 찾기 요청
    @PostMapping("findPw")
    public ResponseEntity<Map<String, String>> findPassword(@RequestBody Map<String, String> request) {
        String id = request.get("id");
        String name = request.get("name");
        String phone = request.get("phone");

        // 🔥 1. 사용자가 입력한 정보 검증
        boolean exists = memberService.validateMemberForPasswordReset(id, name, phone);
        if (!exists) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "입력한 정보와 일치하는 계정이 없습니다."));
        }

        // ✅ 2. 정보가 맞으면 프론트에서 ResetPassword 페이지로 이동
        Map<String, String> response = new HashMap<>();
        response.put("id", id); // 비밀번호 변경 페이지로 넘길 ID 정보
        return ResponseEntity.ok(response);
    }

    // 🔥 비밀번호 변경
    @PostMapping("resetPw")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordChangeRequest2 request) {
        try {
            memberService.updatePassword(request.getId(), request.getNewPassword());
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("비밀번호 변경 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }





}
