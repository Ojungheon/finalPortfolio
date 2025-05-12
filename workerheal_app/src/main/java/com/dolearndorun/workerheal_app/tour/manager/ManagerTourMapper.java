package com.dolearndorun.workerheal_app.tour.manager;

import com.dolearndorun.workerheal_app.tour.TourAttachmentVo;
import com.dolearndorun.workerheal_app.tour.TourVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ManagerTourMapper {

    // 관광정보 등록
    @Insert("""
            INSERT INTO TOUR_SPOT
            (
                NO
                , MANAGER_NO
                , REGION_NO
                , CATEGORY_NO
                , NAME
                , PHONE
                , PRICE
                , DETAIL
                , LINK_PATH
                , TAG
                , FACILITIE_CODE
                , POSTCODE
                , ROAD_ADDRESS
                , DETAIL_ADDRESS
                , ENROLL_DATE
                , MODIFY_DATE
            )
            VALUES
            (
                SEQ_TOUR_SPOT.NEXTVAL
                , #{managerNo}
                , #{regionNo}
                , #{categoryNo}
                , #{name}
                , #{phone}
                , #{price}
                , #{detail}
                , #{linkPath}
                , #{tag}
                , #{facilitieCode}
                , #{postcode}
                , #{roadAddress}
                , #{detailAddress}
                , SYSDATE
                , SYSDATE
            )
            """)
    int insertTour(TourVo vo);

    // 관광정보 이미지 등록
    int insertTourAttachment(@Param("list") List<TourAttachmentVo> imgVoList , String no);

    // 관광정보 삭제
    int deleteTourInfo(@Param("list") List<String > noList);

    // 관광정보 첨부파일 삭제
    int deleteTourAttachment(@Param("list") List<String > noList, String type);

    // 관광정보 목록 조회
    @Select("""
            SELECT
               T.NO
               , T.MANAGER_NO
               , M.NAME AS MANAGER_NAME
               , T.REGION_NO
               , R.NAME AS REGION_NAME
               , T.CATEGORY_NO
               , C.NAME AS CATEGORY_NAME
               , T.NAME
               , T.PHONE
               , T.DETAIL
               , T.LINK_PATH
               , T.TAG
               , T.FACILITIE_CODE
               , T.POSTCODE
               , T.ROAD_ADDRESS
               , T.DETAIL_ADDRESS
               , T.ENROLL_DATE
               , T.MODIFY_DATE
               , T.DEL_YN
               FROM TOUR_SPOT T
               JOIN MANAGER M ON (T.MANAGER_NO = M.NO)
               JOIN REGION R ON (T.REGION_NO = R.NO)
               JOIN TOUR_CATEGORY C ON (T.CATEGORY_NO = C.NO)
               WHERE T.DEL_YN = 'N'
               ORDER BY T.NO DESC
               OFFSET #{offSet} ROWS FETCH NEXT #{limit} ROWS ONLY
            """)
    List<TourVo> tourListByPageNo(int offSet, int limit);

    // 등록된 총 관광정보 수량 확인 - 태훈
    @Select("""
            SELECT
            COUNT(NO)
            FROM TOUR_SPOT
            WHERE DEL_YN = 'N'
            """)
    long totalTourCnt();

    // 관광정보 상세 조회 by No
    @Select("""
            SELECT
               T.NO
               , T.MANAGER_NO
               , M.NAME AS MANAGER_NAME
               , T.REGION_NO
               , R.NAME AS REGION_NAME
               , T.CATEGORY_NO
               , C.NAME AS CATEGORY_NAME
               , T.NAME
               , T.PHONE
               , T.PRICE
               , T.DETAIL
               , T.LINK_PATH
               , T.TAG
               , T.FACILITIE_CODE
               , T.POSTCODE
               , T.ROAD_ADDRESS
               , T.DETAIL_ADDRESS
               , T.ENROLL_DATE
               , T.MODIFY_DATE
               , T.DEL_YN
               FROM TOUR_SPOT T
               JOIN MANAGER M ON (T.MANAGER_NO = M.NO)
               JOIN REGION R ON (T.REGION_NO = R.NO)
               JOIN TOUR_CATEGORY C ON (T.CATEGORY_NO = C.NO)
               WHERE T.NO = #{no}
               AND T.DEL_YN = 'N'
            """)
    TourVo getTourDetailByNo(String no);

    // 관광정보 첨부파일 목록 조회 by No
    @Select("""
            SELECT
            NO
            , TOUR_NO
            , ORIGIN_NAME
            , CHANGE_NAME
            , PATH
            , ORDER_NO
            , UPLOAD_DATE
            , DEL_YN
            FROM ATTACHMENT_TOUR_SPOT
            WHERE TOUR_NO = #{no}
            AND DEL_YN = 'N'
            ORDER BY ORDER_NO ASC
            """)
    List<TourAttachmentVo> getTourAttachmentListByNo(String no);

    // 관광정보 수정
    @Update("""
            UPDATE TOUR_SPOT
            SET
            REGION_NO = #{regionNo}
            , CATEGORY_NO = #{categoryNo}
            , NAME = #{name}
            , PHONE = #{phone}
            , PRICE = #{price}
            , DETAIL = #{detail}
            , LINK_PATH = #{linkPath}
            , TAG = #{tag}
            , FACILITIE_CODE = #{facilitieCode}
            , POSTCODE = #{postcode}
            , ROAD_ADDRESS = #{roadAddress}
            , DETAIL_ADDRESS = #{detailAddress}
            , MODIFY_DATE = SYSDATE
            WHERE NO = #{no}
            """)
    int updateTourInfo(TourVo vo);

    // 첨부파일 서버 저장 시 orderNo 재부여
    int updateOrderNo(String no);

    // 삭제하려는 관광정보 항목에 예약 내역 존재하는지 확인
    List<String> checkTourReservation(List<String> noList);
}//class


