package com.dolearndorun.workerheal_app.tour.user;

import com.dolearndorun.workerheal_app.office.OfficeVo;
import com.dolearndorun.workerheal_app.tour.TourVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/tour")
@RequiredArgsConstructor
@Slf4j
public class TourController {

    private final TourService service;

    // 관광정보 목록 조회
    @GetMapping("list")
    public List<TourVo> list( @RequestParam (value = "cateNo", required = false, defaultValue = "1")int cateNo, @RequestParam(defaultValue = "1") int pno) {
        List<TourVo> result = service.tourList(cateNo, pno);
        return result;

        // service 호출
//        try {
//            return ResponseEntity.status(200).body(service.tourListByPageNo(pno, limit));
//        } catch (Exception e) {
//            System.out.println("e = " + e);
//            throw new IllegalStateException("관광정보 조회 오류");
//        }
    }


        // 관광 상세 조회
        @GetMapping("detail")
        public Map<String, Object> tourListByNo(int no) {
            System.out.println("no = " + no);
           return service.tourListByNo(no);
        }
}



