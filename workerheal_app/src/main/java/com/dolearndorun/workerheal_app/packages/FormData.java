package com.dolearndorun.workerheal_app.packages;

import com.dolearndorun.workerheal_app.lodging.LodgingDetailedVo;
import com.dolearndorun.workerheal_app.lodging.LodgingRoomTypeVo;
import com.dolearndorun.workerheal_app.office.OfficeDetailedVo;
import com.dolearndorun.workerheal_app.payment.PaymentVo;
import com.dolearndorun.workerheal_app.tour.TourVo;
import lombok.Data;

import java.util.List;

@Data
public class FormData {

    private PackagesVo a;
    private OfficeDetailedVo b;
    private LodgingDetailedVo c;
    private List<LodgingRoomTypeVo> d;
    private TourVo e;
    private ReservationPackageVo f;
    private ReservationTourVo g;
    private ReservationLodgingVo h;
    private ReservationOfficeVo reservation;
    private OfficeDetailedVo info;
    private PaymentVo payVo; // 태훈 추가

}
