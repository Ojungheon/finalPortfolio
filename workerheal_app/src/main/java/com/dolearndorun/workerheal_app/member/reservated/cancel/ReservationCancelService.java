package com.dolearndorun.workerheal_app.member.reservated.cancel;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationCancelService {

    private final ReservationCancelMapper reservationCancelMapper;

    public void cancelReservation(String reservationNo) throws Exception {
        System.out.println("reservationNo = " + reservationNo);
        reservationCancelMapper.deleteLReservation(reservationNo);
        reservationCancelMapper.deleteOReservation(reservationNo);
        reservationCancelMapper.deletePReservation(reservationNo);
    }
}
