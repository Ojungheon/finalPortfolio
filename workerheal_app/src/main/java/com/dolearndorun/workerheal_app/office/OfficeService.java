package com.dolearndorun.workerheal_app.office;


import com.dolearndorun.workerheal_app.packages.FormData;
import com.dolearndorun.workerheal_app.packages.ReservationOfficeVo;
import com.dolearndorun.workerheal_app.payment.PaymentMapper;
import com.dolearndorun.workerheal_app.payment.PaymentVo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OfficeService {

    private final OfficeMapper mapper;

    private final PaymentMapper paymentMapper;

    public List<OfficeVo> list(int pno) {
        int limit = 10;
        int offset = (pno-1) * limit;
        List<OfficeVo> aaa  = mapper.list(offset, limit); // 태훈
        System.out.println("pno = " + pno); // 태훈
        System.out.println("aaa = " + aaa); // 태훈
        return mapper.list(offset, limit);
    }

    // 오피스 상세 정보
    public OfficeVo officeDetail(int no) {
        System.out.println("no = " + no);
        return mapper.officeDetail(no);
    }

    // 오피스 첨부파일
    public List<AttachmentOfficeVo> officeAttach(int no){
        System.out.println("OfficeService.officeAttach");
        return mapper.officeAttach(no);
    }

    // 오피스 리뷰
    public List<OfficeReviewDetailedVo> reviews(int no){
        return mapper.reviews(no);
    }

    // 오피스 리뷰 첨부파일
    public List<AttachmentOfficeReviewVo> reviewAttach(Long no){
        return mapper.reviewAttach(no);
    }

    // 오피스 리뷰 상세조회
    public List<OfficeReviewVo> reviewList(int no) {
        return mapper.reviewList(no);
    }

    // 오피스 예약하기
    public void officeReservation(FormData data , Long memberNo) {
    //데이터만 잘 가져오면 됨
        OfficeDetailedVo info = data.getInfo();
        ReservationOfficeVo reservation = data.getReservation();
        reservation.setMemberNo(memberNo); // 토큰에서 회원정보 뽑아내서 저장 - 태훈 추가
        PaymentVo payVo = data.getPayVo(); // 태훈 추가
        reservation.setReservationNo(payVo.getReservationNo()); // 결제정보에서 결제번호 가져와서 추가 - 태훈 추가
        
        System.out.println("info = " + info);
        System.out.println("reservation = " + reservation);
        System.out.println("payVo = " + payVo); // 태훈 추가

//        if(info.getOfficeExtraCode() == null){
//            info.setOfficeExtraCode("001,002");

        System.out.println("1111111111111111");
        mapper.officeReservation(info, reservation);
        System.out.println("222222222222222222222");
        if(reservation.getFaciliteCode() != null){ // 추가용품 없으면 미진행 - 태훈 수정
            // 추가용품 여러 종류일 경우 처리 가능하도록 코드 수정 - 태훈
            String code = reservation.getFaciliteCode();
            String amount = reservation.getAmount();
            List<String> codeList = new ArrayList<>();
            List<Integer> amountList = new ArrayList<>();
            if(code.contains(",")){
                codeList = Arrays.asList(code.split(","));
                String[] amountArray = amount.split(",");
                for (String amt : amountArray) {
                    amountList.add(Integer.parseInt(amt.trim())); // 문자열을 정수로 변환 후 리스트에 추가
                }
            }
            else{
                codeList.add(code);
                amountList.add(Integer.parseInt(amount));
            }
            String reservationNO = payVo.getReservationNo();
            for (int i = 0; i < codeList.size(); i++) {
//            mapper.officeFacilite(reservation); // 태훈 수정
                mapper.officeFacilite(reservationNO, codeList.get(i), amountList.get(i));
            }
        }
        System.out.println("333333333333333");

        // 결제정보 DB 저장 - 태훈 추가
        payVo.setMemberNo(memberNo);
        paymentMapper.enrollPayInfo(payVo);

    }


    // 오피스 찜 하기
    public void favorite(OfficeSavedVo vo){
        mapper.favorite(vo);
    }

    // 찜 삭제
    public int favoriteDelete(int memberNo, int officeNo) {
        return mapper.favoriteDelete(memberNo, officeNo);
    }

    public List<OfficeVo> mainList() {
        return mapper.mainList();
    }
}
