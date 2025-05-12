package com.dolearndorun.workerheal_app.office.manager;

import com.dolearndorun.workerheal_app.office.OfficeVo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class ManagerOfficeService {

    private final ManagerOfficeMapper mapper;

    // 오피스 목록 조회 - 태훈
    public Map officeListByPageNo(int pno, int limit) {

        // 페이지 별 데이터 수 확인
         int offSet = (pno-1)*limit;

        // 전체 페이지 수 수집
        long totalDataCnt = mapper.totalOfficeCnt();
        int totalPagesCnt = (int) Math.ceil((double) totalDataCnt / limit);

        // 리스트 정보 수집
        List<OfficeVo> voList = mapper.officeListByPageNo(offSet,limit);

        // 수집한 정보 map 저장
        Map map = new HashMap();
        map.put("totalPages",totalPagesCnt);
        map.put("officeVoList",voList);

        return map;

    }//officeListByPageNo

    // 오피스 삭제
    public String deleteOfficeInfo(List<String> noList) {

        // 삭제하려는 항목의 예약내역 존재여부 확인
        List<String> reservationList =  mapper.checkOfficeReservation(noList);
        if(reservationList.size() >0){
            return String.join(", ",reservationList);
        }
        
        // 오피스 삭제
        int result1 = mapper.deleteOfficeInfo(noList);
        System.out.println("result1 = " + result1);

        // 오피스 첨부파일 삭제
        int result2 = mapper.deleteOfficeAttachment(noList);
        System.out.println("result2 = " + result2);

        return "success";

    }//deleteOfficeInfo

}//class
