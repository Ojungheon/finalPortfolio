package com.dolearndorun.workerheal_app.member.reservated.cancel;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReservationCancelMapper {


    // 예약 삭제
    @Delete("DELETE FROM RESERVATION_LODGING WHERE TRIM(RESERVATION_NO) = TRIM(#{reservationNo})")
    void deleteLReservation(@Param("reservationNo") String reservationNo);
    @Delete("DELETE FROM RESERVATION_OFFICE WHERE TRIM(RESERVATION_NO) = TRIM(#{reservationNo})")
    void deleteOReservation(@Param("reservationNo") String reservationNo);
    @Delete("DELETE FROM RESERVATION_PACKAGE WHERE TRIM(RESERVATION_NO) = TRIM(#{reservationNo})")
    void deletePReservation(@Param("reservationNo") String reservationNo);

}
