package com.dolearndorun.workerheal_app.lodging.manager;

import com.dolearndorun.workerheal_app.lodging.LodgingVo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class ManagerLodgingService {

    private final ManagerLodgingMapper mapper;

    // 숙소 목록 조회 - 태훈
    public Map<String, Object> LodgingListByPageNo(int pno, int limit) {

        // 페이지 별 데이터 수 확인
         int offSet = (pno-1)*limit;

        // 전체 페이지 수 수집
        long totalDataCnt = mapper.totalLodgingCnt();
        int totalPagesCnt = (int) Math.ceil((double) totalDataCnt / limit);

        // 리스트 정보 수집
        List<LodgingVo> voList = mapper.LodgingListByPageNo(offSet,limit);

        // 수집한 정보 map 저장
        Map<String, Object> map = new HashMap<>();
        map.put("totalPages",totalPagesCnt);
        map.put("lodgingVoList",voList);

        return map;

    }//LodgingListByPageNo

    // 숙소 삭제
    public String deleteLodgingInfo(List<String> noList) {

        // 삭제하려는 항목의 예약내역 존재여부 확인
        List<String> reservationList =  mapper.checkLodgingReservation(noList);
        if(reservationList.size() >0){
            return String.join(", ",reservationList);
        }

        // 숙소 삭제
        int result1 = mapper.deleteLodgingInfo(noList);
        System.out.println("result1 = " + result1);

        // 숙소 첨부파일 삭제
        int result2 = mapper.deleteLodgingAttachment(noList);
        System.out.println("result2 = " + result2);

        return "success";

    }//deleteLodgingInfo

}//class
