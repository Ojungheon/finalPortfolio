package com.dolearndorun.workerheal_app.packages.user;

import com.dolearndorun.workerheal_app.lodging.LodgingDetailedVo;
import com.dolearndorun.workerheal_app.lodging.LodgingRoomTypeAttachVo;
import com.dolearndorun.workerheal_app.lodging.LodgingRoomTypeVo;
import com.dolearndorun.workerheal_app.lodging.user.LodgingService;
import com.dolearndorun.workerheal_app.office.OfficeService;
import com.dolearndorun.workerheal_app.packages.PackagesReviewAttachmentVo;
import com.dolearndorun.workerheal_app.packages.PackagesReviewVo;
import com.dolearndorun.workerheal_app.packages.PackagesVo;
import com.dolearndorun.workerheal_app.packages.FormData;
import com.dolearndorun.workerheal_app.tour.user.TourService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("api/package")
public class PackagesController {

    private final PackagesService packagesService;
    private final OfficeService officeService;
    private final LodgingService lodgingService;
    private final TourService tourService;
    
    // 패키지 목록
    @GetMapping("list")
    public List<PackagesVo> packageList(@RequestParam(defaultValue = "1") int pno) {

        List<PackagesVo> result = packagesService.packageList(pno);

        return result;
    }

    // 메인화면 패키지 목록
    @GetMapping("mainList")
    public List<PackagesVo> mainList(){
        List<PackagesVo> result = packagesService.mainList();
        return result;
    }


    // 상세 페이지
    @GetMapping("detail")
    public Map<String, Object> packageDetail(@RequestParam int no) {
        System.out.println("package no = " + no);

        Map<String, Object> packageData = new HashMap<>();

        // 패키지 상세 정보
        PackagesVo dbVo = packagesService.detail(no);
        packageData.put("packageInfo", dbVo);
        packageData.put("packAttach", packagesService.packageAttach(no));

        // 패키지 리뷰 가져오기
        List<PackagesReviewVo> reviewList = packagesService.reviews(no);
        packageData.put("reviewVo", reviewList);

        // 리뷰 첨부파일 (리뷰 번호별 매핑)
        HashMap<Object, Object> reviewAttachments = new HashMap<>();

        if (!reviewList.isEmpty()) { //리뷰가 있을 때만 첨부파일 가져옴
            for (PackagesReviewVo review : reviewList) {
                int reviewNo = Math.toIntExact(review.getNo());
                List<PackagesReviewAttachmentVo> attachments = packagesService.reviewsAttach(reviewNo);
                reviewAttachments.put(reviewNo, attachments != null ? attachments : List.of()); //null 방지
            }
        }
        packageData.put("reviewAttach", reviewAttachments);

        // 오피스 상세 정보
        packageData.put("officeDetail", officeService.officeDetail(Integer.parseInt(dbVo.getOfficeNo())));
        packageData.put("officeAttach", officeService.officeAttach(Integer.parseInt(dbVo.getOfficeNo())));

        // 숙소 상세 정보
        LodgingDetailedVo lodgingVo =  lodgingService.lodgingDetail(Integer.parseInt(dbVo.getLodgingNo()));
        packageData.put("lodgingDetail",lodgingVo);
        packageData.put("lodgingAttach", lodgingService.lodgingAttach((int)(long) lodgingVo.getNo()));
        List<LodgingRoomTypeVo> roomList =  lodgingService.roomType((int)(long) lodgingVo.getNo());
        List<List<LodgingRoomTypeAttachVo>> tempList = new ArrayList<>();
        packageData.put("roomTypeVo", roomList);
        for (LodgingRoomTypeVo vo : roomList) {
            List<LodgingRoomTypeAttachVo> imgList = lodgingService.RoomTypeAttach((int)(long)vo.getNo());
            tempList.add(imgList);
        }
        packageData.put("roomTypeAttach",tempList);


        // 관광 상세 정보
        packageData.put("tourDetail", tourService.tourListByNo(Integer.parseInt(dbVo.getTourSpotNo())));

        return packageData;
    }



    // 패키지 리뷰 상세 조회
    @GetMapping("review")
    public Map<String, Object> reviewDetail(@RequestParam int no) {
        Map<String, Object> packageData = new HashMap<>();

        // 패키지 리뷰 가져오기
        List<PackagesReviewVo> reviewList = packagesService.reviews(no);
        packageData.put("reviews", reviewList);

        // 리뷰 첨부파일 (리뷰 번호별 매핑) 첨부파일 시발롬
        HashMap<Object, Object> reviewAttachments = new HashMap<>();

        if (!reviewList.isEmpty()) { //리뷰가 있을 때만 첨부파일 가져옴
            for (PackagesReviewVo review : reviewList) {
                int reviewNo = Math.toIntExact(review.getNo());
                List<PackagesReviewAttachmentVo> attachments = packagesService.reviewsAttach(reviewNo);
                reviewAttachments.put(reviewNo, attachments != null ? attachments : List.of()); //null 방지
            }
        }
        packageData.put("reviewAttachment", reviewAttachments);

        return packageData;
    }


    // 패키지 예약
    @PostMapping("reservation")
    public void packageReservation (@RequestBody FormData x){
//        System.out.println("x = " + x);

        packagesService.packageReservate(x);

        System.out.println("서비스 동작 완료 @@@@@@@@@@@@");

    }
}
