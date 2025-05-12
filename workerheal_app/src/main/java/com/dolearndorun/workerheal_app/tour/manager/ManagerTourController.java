package com.dolearndorun.workerheal_app.tour.manager;

import com.dolearndorun.workerheal_app.security.SecurityUserDetails;
import com.dolearndorun.workerheal_app.tour.TourVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/manager/tour")
@RequiredArgsConstructor
@Slf4j
public class ManagerTourController {

    private final ManagerTourService service;

    // 관광정보 등록
    @PostMapping("enroll")
    public ResponseEntity<String> tourEnroll(TourVo vo, @RequestParam("imgList") List<MultipartFile> fileList,@RequestParam("order[]") List<Integer> addOrderNo)  {
        System.out.println("vo = " + vo);

        // SecurityUserDetails 에서 작성자 정보 수집
        SecurityUserDetails khUserDetails = (SecurityUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long writerNo = khUserDetails.getNo();
        vo.setManagerNo(writerNo);

        // service 호출
        try {
            service.tourEnroll(fileList,vo,addOrderNo);
            return ResponseEntity.status(200).body("등록 성공");
        }catch (Exception e){
            System.out.println("e = " + e);
            log.error("관광정보 등록 오류 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("관광정보 등록 중 서버 에러로 등록에 실패했습니다.");
        }

    }//tourEnroll

    // 관광정보 삭제
    @DeleteMapping("delete")
    public ResponseEntity<String> deleteTourInfo(@RequestBody List<String> noList){

        // service 호출
        try {
            return ResponseEntity.ok(service.deleteTourInfo(noList));
        } catch (Exception e){
            System.out.println("e = " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("선택된 항목 삭제 중 서버 에러로 삭제처리에 실패했습니다..");
        }

    }//deleteTourInfo

    // 관광정보 목록 조회 - 태훈
    @GetMapping("list")
    public ResponseEntity<Map> getTourList(@RequestParam(defaultValue = "1") int pno, @RequestParam(defaultValue = "10") int limit) {

        // service 호출
        try {
            return ResponseEntity.status(200).body(service.tourListByPageNo(pno, limit));
        } catch (Exception e) {
            System.out.println("e = " + e);
            log.error("관광정보 목록 조회 오류 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","관광정보 목록을 불러오는 중 서버에서 오류가 발생했습니다."));
        }

    }//getTourList

    // 관광정보 상세 조회 - 태훈
    @GetMapping("detail/{no}")
    public ResponseEntity<Map> getTourByNo(@PathVariable("no") String no){

        // service 호출
        try {
            return ResponseEntity.status(200).body(service.getTourByNo(no));
        } catch (Exception e) {
            System.out.println("e = " + e);
            log.error("관광정보 상세 조회 오류 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","선택한 관광정보의 상세정보를 불러온는 중 오류가 발생했습니다."));
        }

    }//getTourInfo

    // 관광정보 수정 - 태훈
    @PostMapping("edit")
    public ResponseEntity<String> editTourByNo(TourVo vo, @RequestParam(required = false, value="imgList") List<MultipartFile> fileList, @RequestParam(required = false, value="deleteNoList") List<String> deleteNoList,@RequestParam(required = false, value="order[]") List<Integer> addOrderNo){

        // service 호출
        try {
            service.editTourByNo(vo,fileList,deleteNoList,addOrderNo);
            return ResponseEntity.status(200).body("수정 성공");
        } catch (Exception e) {
            System.out.println("e = " + e);
            log.error("관광정보 수정 오류 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("관광정보 수정 중 서버 에러로 등록에 실패했습니다.");
        }
        
    }//editTourByNo

}//class
