package com.dolearndorun.workerheal_app.host;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkplaceService {

    private final WorkplaceMapper workplaceMapper;

    public List<WorkplaceVo> select() {
        System.out.println("WorkplaceService.select");
        List<WorkplaceVo> voList = workplaceMapper.sellect();
        return voList;
    }

    public List<WorkplaceReserveVo> selectReserve() {
        List<WorkplaceReserveVo> voList = workplaceMapper.sellectReserve();
        return voList;
    }

    public List<WorkplaceTempVo> tempSelect() {
        List<WorkplaceTempVo> voList = workplaceMapper.tempSelect();
        return voList;
    }

    public List<LodgingReserveVo> selectLReserveList(int lodgingNo) {
        return workplaceMapper.selectLReserveList(lodgingNo);
    }

    public List<OfficeReserveVo> selectOReserveList(int officeNo) {
        return workplaceMapper.selectOReserveList(officeNo);
    }

    public OfficeReserveVo selectReserveDetail(int reservationNo) {
        return workplaceMapper.selectOrReserveDetail(reservationNo);
    }
}
