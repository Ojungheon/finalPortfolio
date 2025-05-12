package com.dolearndorun.workerheal_app.host;

import lombok.Data;

@Data
public class WorkplaceReserveVo {

        private String reservationId;
        private String userId;
        private String status;
        private String placeNo;
        private String guestCount;       // 예약 인원 (숫자)
        private String totalPrice; // 가격 (소수점 고려)
        private String extraCode;
        private String checkinDate;  // 체크인 날짜
        private String checkoutDate; // 체크아웃 날짜
        private String bookingDate;  // 예약한 날짜
        private String packageYn;        // 패키지 여부 (Y/N)
        private String placeType;        // LODGING / OFFICE
        private String placeName;
        private String reserveName;
        private String reservePhone;
}
