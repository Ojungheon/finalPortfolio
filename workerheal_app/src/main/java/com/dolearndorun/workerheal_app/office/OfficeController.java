package com.dolearndorun.workerheal_app.office;

import com.dolearndorun.workerheal_app.packages.FormData;
import com.dolearndorun.workerheal_app.payment.PayInfoVo;
import com.dolearndorun.workerheal_app.security.SecurityUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.apache.ibatis.annotations.Delete;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("api/office")
public class OfficeController {

    private final OfficeService service;

    // 오피스 목록 조회
    @GetMapping("list")
    public List<OfficeVo> list(@RequestParam(defaultValue = "1") int pno) {
        List<OfficeVo> result = service.list(pno);
        return result;
    }

    // 메인화면 오피스 목록 조회 (별점순)
    @GetMapping("mainList")
    public List<OfficeVo> mainList(){
        List<OfficeVo> result = service.mainList();
        return result;
    }


    // 오피스 상세 조회
    @GetMapping("detail")
    public Map<String, Object> officeDetail(int no) {
        System.out.println("office no = " + no);
        // 오피스 정보
        OfficeVo detailVo = service.officeDetail(no);
        // 오피스 첨부파일
        List<AttachmentOfficeVo> officeAttachVo = service.officeAttach(no);

        // 오피스 리뷰
        List<OfficeReviewDetailedVo> reviewVo = service.reviews(no); //오피스에 대한 여러 개의 리뷰가 reviewVo 리스트에 담아줌
        // 오피스 리뷰 첨부파일
        // 리뷰별로 첨부파일 리스트를 따로 저장해야 하므로, 2중 리스트 사용함
        List<List<AttachmentOfficeReviewVo>> reviewAttachVo = new ArrayList<>();
        for (OfficeReviewDetailedVo vo : reviewVo) {
            List<AttachmentOfficeReviewVo> reviewVoList = service.reviewAttach(vo.getNo());
            reviewAttachVo.add(reviewVoList);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("officeInfo", detailVo);
        result.put("officeAttachments", officeAttachVo);
        result.put("reviews", reviewVo);
        result.put("reviewAttachments", reviewAttachVo);

        return result;
    }

    // 오피스 리뷰 조회
    @GetMapping("review")
    public List<OfficeReviewVo> reviewList(int no) {
        System.out.println("no = " + no);
        System.out.println("OfficeController.reviewList");
        List<OfficeReviewVo> result = service.reviewList(no);
        return result;
    }

    // 오피스 예약
    @PostMapping("reservation")
    public ResponseEntity<String> officeReservation(@RequestBody FormData data){

        // SecurityUserDetails 에서 작성자 정보 수집 
        SecurityUserDetails userDetails = (SecurityUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long memberNo = userDetails.getNo(); // 태훈 추가

        System.out.println("data = " + data);// 태훈 수정 - 서버 리턴 결과 변경
        try {
            service.officeReservation(data,memberNo);
            return ResponseEntity.ok("예약 성공");
        }catch (Exception e){
            System.out.println("e = " + e);
            log.error("예약 및 결제정보 저장 실패 :: "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예약 및 결제정보를 서버 전달 중 오류가 발생했습니다.");
        }

    }

    // 특정 오피스 찜하기
    @PostMapping("favorite")
    public ResponseEntity<String> favorite(@RequestBody OfficeSavedVo vo) {
        try {
            System.out.println("받은 데이터: " + vo);

            if (vo.getMemberNo() == null || vo.getOfficeNo() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("멤버no 또는 오피스no가 없음");
            }

            service.favorite(vo);
            return ResponseEntity.ok().body("찜 추가 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("찜 추가 실패");
        }
    }


    // 오피스 찜 삭제하기
    @DeleteMapping("favorite")
    public ResponseEntity<String> favoriteDelete( @RequestParam("memberNo") int memberNo,
                                                  @RequestParam("officeNo") int officeNo) {
        try {
            int result = service.favoriteDelete(memberNo, officeNo);

            if (result > 0) {
                return ResponseEntity.ok("찜 해제 성공");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("삭제할 데이터가 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("찜 해제 실패: " + e.getMessage());
        }
    }

}
