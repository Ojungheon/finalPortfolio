package com.dolearndorun.workerheal_app.tour.user;

import com.dolearndorun.workerheal_app.tour.TourAttachmentVo;
import com.dolearndorun.workerheal_app.tour.TourVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TourService {

    private final TourMapper mapper;

    // 관광정보 목록 조회 - 태훈
//    public Map tourListByPageNo(int pno, int limit) {
//
//        // 페이지 별 데이터 수 확인
//        int offSet = (pno-1)*limit;
//
//        // 전체 페이지 수 수집
//        long totalDataCnt = mapper.totalTourCnt();
//        int totalPagesCnt = (int) Math.ceil((double) totalDataCnt / limit);
//
//        // 리스트 정보 수집
//        List<TourVo> voList = mapper.tourListByPageNo(offSet,limit);
//
//        // 수집한 정보 map 저장
//        Map map = new HashMap();
//        map.put("totalPages",totalPagesCnt);
//        map.put("tourVoList",voList);
//
//        return map;
//
//    }//tourListByPageNo

    public List<TourVo> tourList(int cateNo, int pno) {
        int limit = 20;
        int offset = (pno - 1) * limit;
        return mapper.tourList(cateNo, offset, limit);
    }

//    public TourVo tourListByNo(int no) {
//        return mapper.tourListByNo(no);
//    }

    public Map<String , Object> tourListByNo(int no) {
        System.out.println("TourService.tourListByNo");

        TourVo dbvo = mapper.tourListByNo(no);


        List<String> attachmentVoList = mapper.getTourAttachmentListByNo(no);

        // 수집한 정보 map 저장
        Map<String , Object> map = new HashMap<>();
        map.put("imgList",attachmentVoList);
        map.put("tourVo",dbvo);

        return map;

    } // 태훈 수정

}//class
