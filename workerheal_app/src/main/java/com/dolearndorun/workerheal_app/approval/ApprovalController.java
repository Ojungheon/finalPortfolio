package com.dolearndorun.workerheal_app.approval;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/manager/approval")
@RequiredArgsConstructor
@Slf4j
public class ApprovalController {

    private final ApprovalService service;

    // 사업장 승인요청 목록 조회 - 태훈
    @GetMapping("list")
    public ResponseEntity<Map<String,Object>> getApprovalList(@RequestParam(defaultValue = "1") int pno, @RequestParam(defaultValue = "10") int limit){
        
        // service 호출
        try {
            return ResponseEntity.status(200).body(service.approvalListByPageNo(pno, limit));
        } catch (Exception e) {
            System.out.println("e = " + e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "사업장 승인요청 목록 조회 오류"));
//            throw new IllegalStateException("사업장 승인요청 목록 조회 오류");
        }
        
    }//getApprovalList


    // 오피스 승인요청 상세 조회 - 태훈
    @GetMapping("office/detail")
    public ResponseEntity<Map<String,Object>> getTempOfficeByNo(String no){

        // service 호출
        try {
            return ResponseEntity.status(200).body(service.getTempOfficeByNo(no));
        } catch (Exception e) {
            System.out.println("e = " + e);
            throw new IllegalStateException("오피스 승인요청 상세 조회 오류");
        }

    }//getTempOfficeByNo

    // 숙소 승인요청 상세 조회 - 태훈
    @GetMapping("lodging/detail")
    public ResponseEntity<Map<String,Object>> getTempLodgingByNo(String no){

        // service 호출
        try {
            return ResponseEntity.status(200).body(service.getTempLodgingByNo(no));
        } catch (Exception e) {
            System.out.println("e = " + e);
            throw new IllegalStateException("숙소 승인요청 상세 조회 오류");
        }

    }//getTempLodgingByNo

    // 승인요청 항목 승인
    @PostMapping("accept")
    public ResponseEntity<String> acceptApproval(String no, String place, String type){

        // service 호출
        try {
            int result = service.acceptApproval(no,place,type);
            if (result == 1) {
                return ResponseEntity.status(200).body("요청 내용이 승인 되었습니다.");
            }
            else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("요청 내용 승인 처리에 실패했습니다.");
            }
        } catch (Exception e) {
            System.out.println("e = " + e);
            throw new IllegalStateException("요청 승인 처리 오류");
        }

    }//acceptApproval

    // 승인요청 항목 반려
    @PostMapping("deny")
    public ResponseEntity<String> denyApproval(String no, String place){

        // service 호출
        try {
            int result = service.denyApproval(no,place);
            if (result == 1) {
                return ResponseEntity.status(200).body("요청 내용이 반려 되었습니다.");
            }
            else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("요청 내용 반려 처리에 실패했습니다.");
            }
        } catch (Exception e) {
            System.out.println("e = " + e);
            throw new IllegalStateException("요청 반려 처리 오류");
        }

    }//denyApproval


}//class
