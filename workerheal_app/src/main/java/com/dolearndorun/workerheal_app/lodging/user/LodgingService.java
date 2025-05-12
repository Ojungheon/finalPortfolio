package com.dolearndorun.workerheal_app.lodging.user;


import com.dolearndorun.workerheal_app.lodging.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class LodgingService {

    private final LodgingMapper mapper;

    // 목록 조회
    public List<LodgingVo> lodgingList(int pno) {
        int limit = 10;
        int offset = (pno - 1) * limit;
        List<LodgingVo> aaa = mapper.lodgingList(offset, limit); // 태훈
        System.out.println("pno = " + pno); // 태훈
        System.out.println("aaa = " + aaa); // 태훈
        return mapper.lodgingList(offset, limit);

    }

    // 숙소 정보만
    public LodgingDetailedVo lodgingDetail(int no) {
        System.out.println("LodgingService.lodgingDetail");
        return mapper.lodgingDetail(no);
    }

    // 숙소에 등록된 시설 코드
//    public List<LodgingFacilitieVo> facilitieVo(int no){
//        return mapper.facilitieVo(no);
//    }

    // 숙소에 등록된 첨부파일
    public List<LodgingAttachmentVo> lodgingAttach(int no) {
        System.out.println("LodgingService.lodgingAttach");
        return mapper.lodgingAttach(no);
    }

    // 숙소에 등록된 객실 타입
    public List<LodgingRoomTypeVo> roomType(int no) {
        System.out.println("LodgingService.roomType");
        return mapper.roomType(no);
    }

    // 객실 첨부 파일 정보
    public List<LodgingRoomTypeAttachVo> RoomTypeAttach(int no) {
        System.out.println("LodgingService.RoomTypeAttach");
        return mapper.RoomTypeAttach(no);
    }

    // 숙소에 등록된 리뷰
    public List<LodgingReviewVo> reviews(int no) {
        return mapper.reviews(no);
    }

    // 리뷰 첨부파일
    public List<LodgingReviewAttachmentVo> reviewsAttach(int no) {
        return mapper.reviewsAttach(no);
    }

    public List<LodgingReviewDetailedVo> reviewList(int no) {

        return mapper.reviewList(no);
    }

    // 숙소 찜하깅~
    public void favorite(LodgingSavedVo vo) {
        mapper.favorite(vo);
    }

    // 찜 삭제하깅
    public int favoriteDelete(int memberNo, int lodgingNo) {
        return mapper.favoriteDelete(memberNo, lodgingNo);
    }


    public List<LodgingVo> mainList() {
        return mapper.mainList();
    }
}
