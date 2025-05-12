package com.dolearndorun.workerheal_app.host;

import com.dolearndorun.workerheal_app.member.PasswordChangeRequest2;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/host")
@RequiredArgsConstructor
@Slf4j
public class HostController {

    private final HostService hostService;

    @PostMapping("join")
    public void join(@RequestBody HostVo vo){hostService.join(vo);}


    @PostMapping("login")
    public String login(@RequestBody HostVo vo){
        try {
            return hostService.login(vo);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new IllegalStateException("[HOST-LOGIN] LOGIN FAIL");
        }
    }
    // ✅ 아이디 찾기
    @PostMapping("findId")
    public ResponseEntity<String> findId(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String phone = request.get("phone");
        HostVo host = hostService.findHostByNameAndPhone(name, phone);

        if (host != null) {
            return ResponseEntity.ok(host.getId()); // 호스트의 이메일(아이디) 반환
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
        boolean exists = hostService.validateHostForPasswordReset(id, name, phone);
        if (!exists) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "입력한 정보와 일치하는 계정이 없습니다."));
        }

        // ✅ 2. 정보가 맞으면 프론트에서 ResetPassword 페이지로 이동
        Map<String, String> response = new HashMap<>();
        response.put("id", id); // 비밀번호 변경 페이지로 넘길 ID 정보
        return ResponseEntity.ok(response);
    }

    // ✅ 비밀번호 변경
    @PostMapping("resetPw")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordChangeRequest2 request) {
        try {
            hostService.updatePassword(request.getId(), request.getNewPassword());
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("비밀번호 변경 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    // 개인정보 조회
    @GetMapping("detail")
    public List<HostVo> list(@RequestParam(value = "no", defaultValue = "0") int no){
        System.out.println("no = " + no);
        List<HostVo> voList = hostService.select(no);
        return voList;
    }

}
