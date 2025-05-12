package com.dolearndorun.workerheal_app.lodging.user;

import com.dolearndorun.workerheal_app.lodging.*;
import com.dolearndorun.workerheal_app.office.OfficeSavedVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("api/lodging")
@RequiredArgsConstructor
public class LodgingController {

    private final LodgingService service;

    // 숙소 목록 조회
    @GetMapping("list")
    public List<LodgingVo> lodgingList(@RequestParam(defaultValue = "1") int pno) {
        List<LodgingVo> result = service.lodgingList(pno);
        return result;
    }

    // 메인화면 숙소 목록
    @GetMapping("mainList")
    public List<LodgingVo> mainList() {
        List<LodgingVo> result = service.mainList();
        return result;
    }

    // 숙소 상세 조회
    @GetMapping("detail")
    public Map<String, Object> detail(@RequestParam int no) {
        System.out.println("no = " + no);
        System.out.println("LodgingController.detail");

        // 숙소 정보 조회
        LodgingDetailedVo detailVo = service.lodgingDetail(no);

        // 숙소 시설 코드
//       List<LodgingFacilitieVo> facilitieVo =  service.facilitieVo(no);

        // 숙소 첨부파일
        List<LodgingAttachmentVo> attachVo = service.lodgingAttach(no);
        // 숙소에 등록된 객실타입
        List<LodgingRoomTypeVo> roomVo = service.roomType(no);

        // 객실에 등록된 첨부파일
//        List<LodgingRoomTypeAttachVo> roomAttachVo = service.RoomTypeAttach(no);
        List<List<LodgingRoomTypeAttachVo>> roomAttachVo = new ArrayList<>(); // 태훈 수정
        for (LodgingRoomTypeVo vo : roomVo) {
            List<LodgingRoomTypeAttachVo> tempList = service.RoomTypeAttach(vo.getNo().intValue());
            roomAttachVo.add(tempList);
        } // 태훈 수정

        // 숙소에 등록된 리뷰
        List<LodgingReviewVo> review = service.reviews(no);

        // 리뷰 첨부파일
//        List<LodgingReviewAttachmentVo> reviewAttach = service.reviewsAttach(no);
//        List<List<LodgingReviewAttachmentVo>> reviewAttach = new ArrayList<>(); // 태훈 수정
//        for (LodgingReviewVo vo : review) {
//            List<LodgingReviewAttachmentVo> tempList = service.reviewsAttach(vo.getNo().intValue());
//            reviewAttach.add(tempList);
//        } // 태훈 수정

        List<List<LodgingReviewAttachmentVo>> reviewAttach = new ArrayList<>();
        for (LodgingReviewVo vo : review) {
            int reviewNo = vo.getNo().intValue();
            System.out.println("리뷰 번호: " + reviewNo); // 각 리뷰의 No 값

            List<LodgingReviewAttachmentVo> tempList = service.reviewsAttach(reviewNo);
            System.out.println("가져온 첨부파일 개수: " + tempList.size()); // 첨부파일 개수

            reviewAttach.add(tempList);
        }


        // 데이터를 하나의 맵으로 묶기
        Map<String, Object> result = new HashMap<>();
//        result.put("facilitie", facilitieVo);
        result.put("lodgingInfo", detailVo);
        result.put("attachments", attachVo);
        result.put("roomTypes", roomVo);
        result.put("roomAttachments", roomAttachVo);
        result.put("reviews", review);
        result.put("reviewAttachments", reviewAttach);

        return result;
    }


    // 숙소 리뷰 조회
    @GetMapping("review")
    public List<LodgingReviewDetailedVo> reviewList(int no) {
        // 숙소에 등록된 리뷰
        List<LodgingReviewDetailedVo> result = service.reviewList(no);
        System.out.println("result = " + result);
        return result;
    }

    // 특정 숙소 찜하기
    @PostMapping("favorite")
    public ResponseEntity<String> favorite(@RequestBody LodgingSavedVo vo) {
        try {
            System.out.println("받은 데이터: " + vo);

            if (vo.getMemberNo() == null || vo.getLodgingNo() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("멤버no 또는 숙소no가 없음");
            }

            service.favorite(vo);
            return ResponseEntity.ok().body("찜 추가 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("찜 추가 실패");
        }
    }


    // 숙소 찜 삭제하기
    @DeleteMapping("favorite")
    public ResponseEntity<String> favoriteDelete( @RequestParam("memberNo") int memberNo,
                                                  @RequestParam("lodgingNo") int lodgingNo) {
        try {
            int result = service.favoriteDelete(memberNo, lodgingNo);

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
