package com.dolearndorun.workerheal_app.tour.user;

import com.dolearndorun.workerheal_app.tour.TourAttachmentVo;
import com.dolearndorun.workerheal_app.tour.TourVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TourMapper {


    // 관광정보 목록 조회
    @Select("""
    SELECT
       T.NO,
       T.MANAGER_NO,
       M.NAME AS MANAGER_NAME,
       T.REGION_NO,
       R.NAME AS REGION_NAME,
       T.CATEGORY_NO,
       C.NAME AS CATEGORY_NAME,
       A.PATH,
       A.ORDER_NO,
       T.NAME,
       T.PHONE,
       T.DETAIL,
       T.LINK_PATH,
       T.TAG,
       T.FACILITIE_CODE,
       T.POSTCODE,
       T.ROAD_ADDRESS,
       T.DETAIL_ADDRESS,
       T.ENROLL_DATE,
       T.MODIFY_DATE,
       T.DEL_YN
    FROM TOUR_SPOT T
       JOIN MANAGER M ON (T.MANAGER_NO = M.NO)
       JOIN REGION R ON (T.REGION_NO = R.NO)
       JOIN TOUR_CATEGORY C ON (T.CATEGORY_NO = C.NO)
       JOIN ATTACHMENT_TOUR_SPOT A ON (T.NO = A.TOUR_NO)
    WHERE T.CATEGORY_NO = #{cateNo}
      AND T.DEL_YN = 'N'
      AND A.ORDER_NO = 1 
      AND A.DEL_YN = 'N'
    ORDER BY T.NO DESC
    OFFSET #{offset} ROWS FETCH NEXT #{limit} ROWS ONLY
    """)
    List<TourVo> tourList(@Param("cateNo") int cateNo, @Param("offset") int offset, @Param("limit") int limit);


    // 등록된 총 관광정보 수량 확인 - 태훈
    @Select("""
            SELECT
            COUNT(NO)
            FROM TOUR_SPOT
            WHERE DEL_YN = 'N'
            """)
    long totalTourCnt();

    // 태훈 수정 - AND A.ORDER_NO = 1 추가
    // 태훈 수정 - JOIN ATTACHMENT_TOUR_SPOT A ON (T.NO = A.NO) 코드 JOIN ATTACHMENT_TOUR_SPOT A ON (T.NO = A.TOUR_NO) 로 수정
    @Select("""
                SELECT
                   T.NO,
                   T.MANAGER_NO,
                   M.NAME AS MANAGER_NAME,
                   T.REGION_NO,
                   R.NAME AS REGION_NAME,
                   T.CATEGORY_NO,
                   C.NAME AS CATEGORY_NAME,
                   A.PATH,
                   A.ORDER_NO,
                   T.NAME,
                   T.PRICE,
                   T.PHONE,
                   T.DETAIL,
                   T.LINK_PATH,
                   T.TAG,
                   T.FACILITIE_CODE,
                   T.POSTCODE,
                   T.ROAD_ADDRESS,
                   T.DETAIL_ADDRESS,
                   T.ENROLL_DATE,
                   T.MODIFY_DATE,
                   T.DEL_YN
                FROM TOUR_SPOT T
                   JOIN MANAGER M ON (T.MANAGER_NO = M.NO)
                   JOIN REGION R ON (T.REGION_NO = R.NO)
                   JOIN TOUR_CATEGORY C ON (T.CATEGORY_NO = C.NO)
                   JOIN ATTACHMENT_TOUR_SPOT A ON (T.NO = A.TOUR_NO)
                WHERE T.NO = #{no}
                  AND T.DEL_YN = 'N'
                  AND A.ORDER_NO = 1
                  AND A.DEL_YN = 'N'
                ORDER BY T.NO DESC
            """)
    TourVo tourListByNo(int no);

    // 관광정보 첨부파일 목록 조회 by No
    @Select("""
            SELECT
            PATH
            FROM ATTACHMENT_TOUR_SPOT
            WHERE TOUR_NO = #{no}
            AND DEL_YN = 'N'
            ORDER BY ORDER_NO ASC
            """)
    List<String> getTourAttachmentListByNo(int no);
}//class
