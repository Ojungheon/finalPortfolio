package com.dolearndorun.workerheal_app.member.reservated;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member/reservated")
@RequiredArgsConstructor
@Slf4j
public class ReservatedController {

    private final ReservatedService reservatedService;


    // ✅ 예약 내역 리스트 조회
    @GetMapping("/{memberNo}")
    public List<ReservatedVo> getReservated(@PathVariable Long memberNo) {
        return reservatedService.getReservatedList(memberNo);
    }

    // ✅ 특정 예약 상세 조회 (오피스 예약)
    @GetMapping("/officeDetail/{reservationNo}")
    public ResponseEntity<?> getOfficeReservatedDetail(@PathVariable String reservationNo) {
        log.info("🔍 오피스 예약 상세 조회 요청 - 예약번호: {}", reservationNo);

//        OfficeReservatedVo detail = reservatedService.getOfficeReservatedDetail(reservationNo);
        Map<String , Object> detail = reservatedService.getOfficeReservatedDetail(reservationNo); // 태훈 수정

        if (detail == null) {
            log.warn("🚨 예약번호 {}에 대한 데이터가 존재하지 않습니다.", reservationNo);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 예약 정보를 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(detail);
    }
    // ✅ 특정 숙소 예약 상세 조회 API
    @GetMapping("/lodgingDetail/{reservationNo}")
    public ResponseEntity<LodgingReservatedVo> getLodgingReservatedDetail(@PathVariable String reservationNo) {
        log.info("🔍 숙소 예약 상세 조회 요청 - 예약번호: {}", reservationNo);
        LodgingReservatedVo detail = reservatedService.getLodgingReservatedDetail(reservationNo);

        if (detail == null) {
            log.warn("🚨 예약번호 {} 에 대한 데이터가 존재하지 않습니다.", reservationNo);
            return ResponseEntity.notFound().build();
        }

        log.info("✅ 조회된 숙소 예약 상세 정보: {}", detail);
        return ResponseEntity.ok(detail);
    }
    // ✅ 특정 패키지 예약 상세 조회 API
    @GetMapping("/packageDetail/{reservationNo}")
//    public ResponseEntity<PackageReservatedVo> getPackageReservatedDetail(@PathVariable String reservationNo) { 
    public ResponseEntity<?> getPackageReservatedDetail(@PathVariable String reservationNo) { // 태훈 수정
        log.info("🔍 예약 상세 조회 요청 - 예약번호: {}", reservationNo);
//        PackageReservatedVo detail = reservatedService.getPackageReservatedDetail(reservationNo);
        Map<String , Object> detail = reservatedService.getPackageReservatedDetail(reservationNo); // 태훈 수정

        if (detail == null) {
            log.warn("🚨 예약번호 {}에 대한 데이터가 존재하지 않습니다.", reservationNo);
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(detail);
    }

    // ✅ 리뷰 작성 API
    @PostMapping("/review")
    public ResponseEntity<Map<String, Object>> writeReview(ReviewVo reviewVo, @RequestParam(required = false, value="image")MultipartFile file) {
        System.out.println("🔍 [DEBUG] 리뷰 작성 요청: " + reviewVo);
        System.out.println("file = " + file);


        try {
            reservatedService.writeReview(reviewVo, file);
            return ResponseEntity.ok(Map.of("message", "리뷰 작성 성공"));
        }catch (Exception e) {
            System.out.println("e = " + e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "리뷰 작성 실패", "message", e.getMessage()));
        }
    }

    // 리뷰 여부
    @GetMapping("/reviewed/{reservationNo}/{productType}")
    public ResponseEntity<Boolean> checkIfReviewExists(
            @PathVariable String reservationNo,
            @PathVariable String productType) {
        boolean exists = reservatedService.isReviewWritten(reservationNo, productType);
        return ResponseEntity.ok(exists);
    }
    // 리뷰 확인 컨트롤러
    @GetMapping("/review/{reservationNo}/{productType}")
    public ResponseEntity<ReviewVo> getReview(
            @PathVariable String reservationNo,
            @PathVariable String productType) {

        try {
            ReviewVo review = reservatedService.getReviewByReservationNo(reservationNo, productType);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }





}
