package com.dolearndorun.workerheal_app.approval;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ApprovalService {

    private final ApprovalMapper mapper;

    // 사업장 승인요청 목록 조회 - 태훈
    public Map<String,Object> approvalListByPageNo(int pno, int limit) {

        // 페이지 별 데이터 수 확인
        int offSet = (pno-1)*limit;

        // 전체 페이지 수 수집
        long totalDataCnt = mapper.totalApprovalCnt();
        int totalPagesCnt = (int) Math.ceil((double) totalDataCnt / limit);

        // 리스트 정보 수집
        List<ApprovalVo> voList = mapper.approvalListByPageNo(offSet,limit);

        // 수집한 정보 map 저장
        Map<String,Object> map = new HashMap<>();
        map.put("totalPages",totalPagesCnt);
        map.put("approvalVoList",voList);
        return map;

    }//approvalListByPageNo

    // 오피스 승인요청 상세 조회 - 태훈
    public Map<String,Object> getTempOfficeByNo(String no) {

        // 오피스 승인요청 데이터 수집
        TempOfficeVo dbVo = mapper.getTempOfficeDetailByNo(no);

        // 오피스 승인요청 첨부파일 수집
        List<TempAttachmentVo> attachmentVoList = mapper.getTempOfficeAttachmentListByNo(no);

        // 수집한 정보 map 저장
        Map<String,Object> map = new HashMap<>();
        map.put("imgList",attachmentVoList);
        map.put("tempOfficeVo",dbVo);
        return map;

    }//getTempOfficeByNo

    // 숙소 승인요청 상세 조회 - 태훈
    public Map<String, Object> getTempLodgingByNo(String no) {

        // 숙소 승인요청 데이터 수집
        TempLodgingVo lodgingVo = mapper.getTempLodgingDetailByNo(no);

        // 숙소 승인요청 첨부파일 수집
        List<TempAttachmentVo> lodgingImgVoList = mapper.getTempLodgingAttachmentListByNo(no);

        // 객실정보 승인요청 데이터 수집
        List<TempRoomTypeVo> roomVoList = mapper.getTempRoomTypeByNo(no);

        // 객실정보 승인요청 첨부파일 수집
        List< List<TempAttachmentVo>> roomImgVoList = new ArrayList<>();
        for (TempRoomTypeVo vo : roomVoList) {
            List<TempAttachmentVo> tempList = mapper.getTempRoomTypeAttachmentListByNo(vo.getNo());
            roomImgVoList.add(tempList);
        }

        // 수집한 정보 map 저장
        Map<String,Object> map = new HashMap<>();
        map.put("tempLodgingVo",lodgingVo);
        map.put("lodgingImgList",lodgingImgVoList);
        map.put("tempRoomVoList",roomVoList);
        map.put("roomImgList",roomImgVoList);
        return map;

    }//getTempLodgingByNo

    /**
     * 승인요청 항목 승인 처리
     * @param no 승인할 요청건의 primarykey
     * @param place 오피스(office) or 숙소(lodging)
     * @param type 신규 등록(1) , 수정 (2)
     * @return
     */
    public int acceptApproval(String no,String place, String type) {

        // 사업장 정보 임시 테이블에서 본 테이블로 이전
        int result1 = 0;
        int currentRoomSeq = 0;
        if(place.equals("office")){
            if (type.equals("1")){
                result1 = mapper.enrollOfficeInfo(no); // 본 테이블에 신규 등록 오피스 데이터 등록
            }
            else{
                result1 = mapper.updateOfficeInfo(no); // 미완
            }
        }else{
            if (type.equals("1")){
                // 본 테이블에 신규 등록 숙소 데이터 등록
                result1 = mapper.enrollLodgingInfo(no);

                // 본 테이블에 신규 등록 숙소의 객실정보 데이터 등록
                int roomCnt = mapper.enrollRoomTypeInfo(no);
                System.out.println("roomCnt = " + roomCnt);

                // 신규 등록한 객실 중 첫 객실의 시퀀스 번호 확인
                currentRoomSeq = mapper.getRoomTypeSeq(); // 마지막으로 등록 된 객실의 시퀀스 번호 확인
                System.out.println("currentRoomSeq1 = " + currentRoomSeq);
                currentRoomSeq = currentRoomSeq - (roomCnt - 1);
                System.out.println("currentRoomSeq2 = " + currentRoomSeq);
            }
            else{
                result1 = mapper.updateLodgingInfo(no); // 미완
            }
        }

        // 사업자 첨부파일 정보 임시 테이블에서 본 테이블로 이전
        if(type.equals("2")){
            result1 = mapper.deleteBeforeAttachment(no,place); // 미완f
        }

        // 임시 오피스 및 임시 숙소의 첨부파일 본 첨부파일 테이블로 이동
        result1 = mapper.acceptWorkplaceAttachment(no,place);

        if(place.equals("lodging")){
            List<Integer> noList = mapper.getTempRoomTypeNo(no); // 해당 숙소의 임시 객실 유형 테이블의 no 값 조회
            for (Integer tempNo : noList) {
                System.out.println("tempNo = " + tempNo);
                System.out.println("currentRoomSeq3 = " + currentRoomSeq);
                int result23 = mapper.acceptRoomTypeAttachment(tempNo+"",currentRoomSeq+""); // 객실 유형의 첨부파일 본 테이블로 이동
                currentRoomSeq++;
            }
        }

        // 등록한 임시 테이블의 첨부파일 삭제
        if(place.equals("lodging")){
            result1 = mapper.deleteTempAttachment(no,"room_type"); // 임시 객실 첨부파일 테이블 데이터 삭제
        }
        result1 = mapper.deleteTempAttachment(no,place);
        System.out.println("result1 = " + result1);


        // 등록한 임시 테이블의 사업자 정보 삭제
        if(place.equals("lodging")){
            result1 = mapper.deleteWorkplaceInfo(no,"room_type"); // 임시 객실 정보 테이블 데이터 삭제
        }
        result1 = mapper.deleteWorkplaceInfo(no,place);

        return result1;

    }//acceptApproval

    // 승인요청 항목 반려 처리
    public int denyApproval(String no, String place) {
        return mapper.denyApproval(no,place);
    }//denyApproval

}//class
