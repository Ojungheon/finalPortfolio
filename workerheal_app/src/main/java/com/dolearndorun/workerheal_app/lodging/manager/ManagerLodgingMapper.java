package com.dolearndorun.workerheal_app.lodging.manager;

import com.dolearndorun.workerheal_app.lodging.LodgingVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ManagerLodgingMapper {

    // 숙소 목록 조회
    @Select("""
            SELECT
            L.NO
            , L.HOST_NO
            , H.NAME AS HOST_NAME
            , L.REGION_NO
            , R.NAME AS REGION_NAME
            , L.TYPE_NO
            , LT.NAME AS TYPE_NAME
            , L.BUSINESS_NO
            , L.NAME
            , L.PHONE
            , L.FACILITIE_CODE
            , L.TAG
            , L.SCORE
            , L.POSTCODE
            , L.ROAD_ADDRESS
            , L.DETAIL_ADDRESS
            , L.ENROLL_DATE
            , L.MODIFY_DATE
            , L.DEL_YN
            FROM LODGING L
            JOIN HOST H ON (L.HOST_NO = H.NO)
            JOIN REGION R ON (L.REGION_NO = R.NO)
            JOIN LODGING_TYPE LT ON (L.TYPE_NO = LT.NO)
            WHERE L.DEL_YN = 'N'
            ORDER BY L.NO DESC
            OFFSET #{offSet} ROWS FETCH NEXT #{limit} ROWS ONLY
            """)
    List<LodgingVo> LodgingListByPageNo(int offSet, int limit);

    // 등록된 총 숙소 수량 확인 - 태훈
    @Select("""
            SELECT
            COUNT(NO)
            FROM Lodging
            WHERE DEL_YN = 'N'
            """)
    long totalLodgingCnt();

    // 숙소 삭제
    int deleteLodgingInfo(@Param("list") List<String> noList);

    // 숙소 첨부파일 삭제
    int deleteLodgingAttachment(@Param("list") List<String > noList);

    // 삭제하려는 숙소의 예약내역 확인
    List<String> checkLodgingReservation(List<String> noList);

}//class
