package com.dolearndorun.workerheal_app.packages.user;

import com.dolearndorun.workerheal_app.lodging.LodgingDetailedVo;
import com.dolearndorun.workerheal_app.lodging.LodgingRoomTypeVo;
import com.dolearndorun.workerheal_app.office.OfficeDetailedVo;
import com.dolearndorun.workerheal_app.office.OfficeMapper;
import com.dolearndorun.workerheal_app.packages.*;
import com.dolearndorun.workerheal_app.tour.TourVo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class PackagesService {

    private final PackagesMapper mapper;
    private final OfficeMapper officeMapper;

    // 패키지 목록
    public List<PackagesVo> packageList(int pno) {
        int limit = 10;
        int offset = (pno-1) * limit;
        return mapper.packageList(offset, limit);
    }

    // 패키지 상세 조회
    public PackagesVo detail(int no){
        return mapper.detail(no);
    }

    // 패키지 첨부파일
    public List<PackagesAttachmentVo> packageAttach(int no){
        return mapper.packageAttach(no);
    }

    // 패키지 리뷰
    public List<PackagesReviewVo> reviews(int no){
        return mapper.reviews(no);
    }

    // 리뷰 첨부파일
    public List<PackagesReviewAttachmentVo> reviewsAttach(int reviewNo) {
        return mapper.reviewsAttach(reviewNo);
    }


    // 오피스 예약
    public void officeReservate(OfficeDetailedVo office, ReservationPackageVo pack){
        mapper.officeReservate(office, pack);
    }

    // 숙소 예약
    public int lodgingReservate(LodgingDetailedVo lodging,  ReservationPackageVo pack){
        return mapper.lodgingReservate(lodging, pack);
    }

    // 숙소에 등록된 룸 타입 별 예약
    public int roomTypeReservate(LodgingRoomTypeVo vo){
        return mapper.roomTypeReservate(vo);
    }

    // 관광 예약
    public int tourReservate(ReservationTourVo tourVo, ReservationPackageVo pack, TourVo tour){
        return mapper.tourReservate(tourVo,pack,tour);
    }

    // 패키지 예약
    public void packageReservate(FormData x){

        PackagesVo pack = x.getA();

        OfficeDetailedVo office = x.getB();
        System.out.println("officeExtraCode = " + office);
        if(office.getOfficeExtraCode() == null){
            office.setOfficeExtraCode("001,002");
        }
        ReservationOfficeVo reservation = x.getReservation();

        LodgingDetailedVo lodging = x.getC();
        List<LodgingRoomTypeVo> room = x.getD();
        TourVo tour = x.getE();
        System.out.println("tour = " + tour);
        ReservationPackageVo reservatePack = x.getF();
        ReservationTourVo reservateTour = x.getG();
        System.out.println("reservateTour = " + reservateTour);
        System.out.println("office = " + office);
        int officeReservation = mapper.officeReservate(office, reservatePack);
        System.out.println("officeReservation = " + officeReservation);

        // 오피스 추가 물품
        String officeReservationNo = mapper.currentOfficeReservationNo();
//        officeMapper.officeFacilite(reservation);
        officeMapper.officeFacilite(officeReservationNo,"001",0); // 태훈 수정 - 일단 임의의 더미 데이터 추가

        System.out.println("11111111111111111111111111111");
        mapper.lodgingReservate(lodging, reservatePack);
        System.out.println("222222222222222222222222222222222222222");
        mapper.tourReservate(reservateTour,reservatePack,tour);
        System.out.println("333333333333333333333333333333333");

        System.out.println("room = " + room);
        for (LodgingRoomTypeVo vo : room) {
            mapper.roomTypeReservate(vo);
        }
        System.out.println("444444444444444444444444444444");


        System.out.println("reservatePack = " + reservatePack);
        System.out.println("pack = " + pack);
        mapper.packageReservate(reservatePack , pack);
        System.out.println("55555555555555555555555555555555");



    }

    public List<PackagesVo> mainList() {
        return mapper.mainList();
    }
}
