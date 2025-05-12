package com.dolearndorun.workerheal_app.manager;

import com.dolearndorun.workerheal_app.common.PageVo;
import com.dolearndorun.workerheal_app.host.BusinessVo;
import com.dolearndorun.workerheal_app.host.HostVo;
import com.dolearndorun.workerheal_app.lodging.LodgingVo;
import com.dolearndorun.workerheal_app.member.MemberVo;
import com.dolearndorun.workerheal_app.member.PasswordChangeRequest2;
import com.dolearndorun.workerheal_app.member.reservated.ReservatedVo;
import com.dolearndorun.workerheal_app.packages.PackagesVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/manager")
@RequiredArgsConstructor
@Slf4j
public class ManagerController {

    private final ManagerService managerService;

    @PostMapping("join")
    public void join(@RequestBody ManagerVo vo){managerService.join(vo);}

    @PostMapping("login")
    public String login(@RequestBody ManagerVo vo){
        try {
            return managerService.login(vo);
        } catch (Exception e){
            log.error(e.getMessage());
            throw new IllegalStateException("[MANAGER-LOGIN] LOGIN FAIL");
        }
    }

    // ✅ 아이디 찾기
    @PostMapping("findId")
    public ResponseEntity<String> findId(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String phone = request.get("phone");
        ManagerVo manager = managerService.findHostByNameAndPhone(name, phone);

        if (manager != null) {
            return ResponseEntity.ok(manager.getId()); // 호스트의 이메일(아이디) 반환
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
        boolean exists = managerService.validateHostForPasswordReset(id, name, phone);
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
            managerService.updatePassword(request.getId(), request.getNewPassword());
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("비밀번호 변경 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    //호스트 리스트 조회
    @GetMapping("/host/list")
    public PageVo<HostVo> listHost(@RequestParam int page, @RequestParam int pageSize) {
        return managerService.listHost(page, pageSize);
    }

    @GetMapping("/hostDetail/{no}")
    public ResponseEntity<Map> getHostDetails(
            @PathVariable Long no,
            @RequestParam(defaultValue = "1") int page,  // 기본값은 1 페이지
            @RequestParam(defaultValue = "5") int pageSize) {  // 기본값은 페이지 크기 5

        // 서비스에서 페이징 처리된 데이터 가져오기
        Map hostDetailsPage = managerService.getHostDetailsWithPagination(no, page, pageSize);

            return ResponseEntity.ok(hostDetailsPage);  // 페이징된 데이터 반환
    }

    @PostMapping("/insertHost")
    public ResponseEntity<Map<String, String>> insertHost(@RequestBody HostVo vo) {
        managerService.insertHost(vo); // 호스트 등록 처리

        Map<String, String> response = new HashMap<>();
        response.put("message", "등록 성공");
        return ResponseEntity.ok(response); // JSON 형태로 응답
    }

    @GetMapping("/member/list")
    public PageVo<MemberVo> listMember(@RequestParam int page, @RequestParam int pageSize) {
        return managerService.getMemberList(page, pageSize);
    }

    @GetMapping("/member/reservDetail/{searchKeyword}")
    public ResponseEntity<?> getReservationDetails(@PathVariable String searchKeyword) {
        try {
            ReservatedVo reservDetail = managerService.getReservationDetails(searchKeyword);
            return ResponseEntity.ok(reservDetail);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("에러 발생: " + e.getMessage());
        }
    }


}
