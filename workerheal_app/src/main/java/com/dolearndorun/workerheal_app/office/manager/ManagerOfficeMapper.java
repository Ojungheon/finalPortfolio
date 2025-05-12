package com.dolearndorun.workerheal_app.office.manager;

import com.dolearndorun.workerheal_app.office.OfficeVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ManagerOfficeMapper {

    // 오피스 목록 조회
    @Select("""
            SELECT
            O.NO
            , O.HOST_NO
            , H.NAME AS HOST_NAME
            , O.REGION_NO
            , R.NAME AS REGION_NAME
            , O.BUSINESS_NO
            , O.NAME AS OFFICE_NAME
            , O.PRICE AS OFFICE_PRICE
            , O.CAPACITY
            , O.SCORE
            , O.ENROLL_DATE
            , O.MODIFY_DATE
            , O.DEL_YN
            FROM OFFICE O
            JOIN HOST H ON (O.HOST_NO = H.NO)
            JOIN REGION R ON (O.REGION_NO = R.NO)
            WHERE O.DEL_YN = 'N'
            ORDER BY O.NO DESC
            OFFSET #{offSet} ROWS FETCH NEXT #{limit} ROWS ONLY
            """)
    List<OfficeVo> officeListByPageNo(int offSet, int limit);

    // 등록된 총 오피스 수량 확인 - 태훈
    @Select("""
            SELECT
            COUNT(NO)
            FROM OFFICE
            WHERE DEL_YN = 'N'
            """)
    long totalOfficeCnt();

    // 오피스 삭제
    int deleteOfficeInfo(@Param("list") List<String> noList);

    // 오피스 첨부파일 삭제
    int deleteOfficeAttachment(@Param("list") List<String > noList);

    // 삭제하려는 오피스의 예약내역 확인
    List<String> checkOfficeReservation(List<String> noList);

}//class
