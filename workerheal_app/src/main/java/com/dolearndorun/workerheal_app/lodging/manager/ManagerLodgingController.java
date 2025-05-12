package com.dolearndorun.workerheal_app.lodging.manager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/manager/lodging")
@RequiredArgsConstructor
@Slf4j
public class ManagerLodgingController {

    private final ManagerLodgingService service;

    // 숙소 목록 조회 - 태훈
    @GetMapping("list")
    public ResponseEntity<Map> getLodgingList(@RequestParam(defaultValue = "1") int pno, @RequestParam(defaultValue = "10") int limit) {

        // service 호출
        try {
            return ResponseEntity.status(200).body(service.LodgingListByPageNo(pno, limit));
        } catch (Exception e) {
            System.out.println("e = " + e);
            throw new IllegalStateException("숙소 목록 조회 오류");
        }

    }//getTourList

    // 숙소 삭제
    @DeleteMapping("delete")
    public ResponseEntity<String> deleteLodgingInfo(@RequestBody List<String> noList){

        // service 호출
        try {
            return ResponseEntity.status(200).body( service.deleteLodgingInfo(noList));
        } catch (Exception e){
            System.out.println("e = " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("선택된 항목 삭제 중 서버 에러로 삭제처리에 실패했습니다..");
        }

    }//deleteLodgingInfo

}//class
