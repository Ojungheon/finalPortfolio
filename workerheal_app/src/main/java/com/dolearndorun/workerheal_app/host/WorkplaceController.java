package com.dolearndorun.workerheal_app.host;

import com.dolearndorun.workerheal_app.util.date.ChangeDate;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/host/workplace")
@RequiredArgsConstructor
public class WorkplaceController {

    private final WorkplaceService workplaceService;
    private final ChangeDate date;

    @GetMapping("list")
    public List<WorkplaceVo> list(WorkplaceVo vo){
        System.out.println("WorkplaceController.list");
        List<WorkplaceVo> voList = workplaceService.select();
        return voList;
    }

    @GetMapping("tempList")
    public List<WorkplaceTempVo> list(WorkplaceTempVo vo){
        List<WorkplaceTempVo> voList = workplaceService.tempSelect();
        return voList;
    }

    @GetMapping("reserveList")
    public List<WorkplaceReserveVo> list(WorkplaceReserveVo vo){
        List<WorkplaceReserveVo> voList = workplaceService.selectReserve();
        return voList;
    }

    @GetMapping("lodgingReserve")
    public List<LodgingReserveVo> getLRList(@RequestParam("lodgingNo") int lodgingNo){

        // 예약 목록을 가져옴
        List<LodgingReserveVo> list = workplaceService.selectLReserveList(lodgingNo);

        // 각 예약 객체 날짜 포맷 변환
        for (LodgingReserveVo vo : list){
            if(vo.getReservateDate() != null){
                vo.setReservateDate(ChangeDate.changeDate2(vo.getReservateDate()));
            }
            if(vo.getStartDate() != null){
                vo.setStartDate(ChangeDate.changeDate2(vo.getStartDate()));
            }
            if(vo.getEndDate() != null){
                vo.setEndDate(ChangeDate.changeDate2(vo.getEndDate()));
            }
        }
        return list;
    }

    @GetMapping("officeReserve")
    public List<OfficeReserveVo> getORLIST(@RequestParam("officeNo") int officeNo){

        // 예약 목록을 가져옴
        List<OfficeReserveVo> list = workplaceService.selectOReserveList(officeNo);

        // 각 예약 객체 날짜 포맷 변환
        for (OfficeReserveVo vo : list){
            if(vo.getReservateDate() != null){
                vo.setReservateDate(ChangeDate.changeDate2(vo.getReservateDate()));
            }
            if(vo.getStartDate() != null){
                vo.setStartDate(ChangeDate.changeDate2(vo.getStartDate()));
            }
            if(vo.getEndDate() != null) {
                vo.setEndDate(ChangeDate.changeDate2(vo.getEndDate()));
            }
        }
        return list;
    }

    // 예약 상세(오피스)
    @GetMapping("officeReserveDetail")
    public OfficeReserveVo getOrDetail(@RequestParam("reservationNo") int reservationNo){
        OfficeReserveVo detail = workplaceService.selectReserveDetail(reservationNo);
        System.out.println("detail = " + detail);
        detail.setReservateDate(ChangeDate.changeDate2(detail.getReservateDate()));
        detail.setStartDate(ChangeDate.changeDate2(detail.getStartDate()));
        detail.setEndDate(ChangeDate.changeDate2(detail.getEndDate()));
        return detail;
    }
}
