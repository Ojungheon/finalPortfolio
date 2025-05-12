package com.dolearndorun.workerheal_app.lodging.user;

import com.dolearndorun.workerheal_app.lodging.*;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface LodgingMapper {

//    DISTINCT로 중복값 제거해줘야됨
    @Select("""
            SELECT
                L.NO,
                L.NAME,
                L.ROAD_ADDRESS,
                L.TAG,
                L.ENROLL_DATE,
                L.REGION_NO,
                R.NAME AS REGION_NAME,
                NVL(MIN(RT.PRICE), 0) AS LOWESTPRICE,
                NVL(AVG(LR.SCORE), 0) AS AVERAGESCORE,
                COUNT(DISTINCT LR.NO) AS COUNT,
                SUM(RT.SLEEPS) AS SLEEPS,
                AL.PATH
            FROM
                LODGING L
            LEFT JOIN
                ROOM_TYPE RT ON L.NO = RT.LODGING_NO
            LEFT JOIN
                RESERVATION_LODGING RL ON L.NO = RL.LODGING_NO
            LEFT JOIN
                LODGING_REVIEW LR ON RL.RESERVATION_NO = LR.RESERVATE_NO
            LEFT JOIN
                ATTACHMENT_LODGING AL
                ON L.NO = AL.LODGING_NO
                AND AL.ORDER_NO = 1
            LEFT JOIN REGION R
               ON L.REGION_NO = R.NO
            WHERE
                L.DEL_YN = 'N'
            GROUP BY
                L.NO, L.NAME, L.ROAD_ADDRESS, L.REGION_NO, L.TAG, L.ENROLL_DATE, R.NAME ,AL.PATH
            ORDER BY
                L.ENROLL_DATE DESC
            OFFSET #{offset} ROWS FETCH NEXT #{limit} ROWS ONLY -- 태훈
            """)
    List<LodgingVo> lodgingList(int offset, int limit);

    @Select("""
              SELECT
                 L.NO,
                 L.NAME,
                 L.PHONE,
                 L.REGION_NO,
                 R.NAME AS REGION_NAME,
                 L.FACILITIE_CODE,
                 L.DETAIL,
                 L.TAG,
                 L.SCORE,
                 L.POSTCODE,
                 L.ROAD_ADDRESS,
                 L.DETAIL_ADDRESS,
                 LT.NAME AS LODGING_TYPE_NAME
             FROM
                 LODGING L
             JOIN
                 LODGING_TYPE LT ON L.TYPE_NO = LT.NO
             JOIN
                 REGION R ON L.REGION_NO = R.NO
             WHERE
                 L.NO = #{no}
                 AND L.DEL_YN = 'N'
            """)
    LodgingDetailedVo lodgingDetail(int no);

//    @Select("""
//            SELECT
//                F.CODE,
//                F.NAME,
//                F.PRODUCT_NO
//            FROM
//                FACILITE F
//            JOIN
//                LODGING L ON REGEXP_LIKE(L.FACILITIE_CODE, '(^|,)' || F.CODE || '(,|$)')
//            WHERE
//                L.NO = #{lodgingNo}
//            """)
//    List<LodgingFacilitieVo> facilitieVo(int no);


    @Select("""
            SELECT
                NO
                ,LODGING_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,PATH
                ,ORDER_NO
                ,UPLOAD_DATE
                ,DEL_YN
            FROM
                ATTACHMENT_LODGING
            WHERE
                LODGING_NO = #{lodgingNo}
                AND DEL_YN = 'N'
            """)
    List<LodgingAttachmentVo> lodgingAttach(int no);

    @Select("""
            SELECT
                RT.NO,
                RT.LODGING_NO,
                RT.NAME,
                RT.PRICE,
                RT.SLEEPS,
                RT.FACILITIE_CODE,
                RT.AMOUNT,
                RT.SINGLE_BED,
                RT.DOUBLE_BED,
                RT.CHECK_IN,
                RT.CHECK_OUT,
                RT.DEL_YN
            FROM
                ROOM_TYPE RT
            WHERE
                RT.LODGING_NO = #{lodgingNo}
                AND RT.DEL_YN = 'N'
            """)
    List<LodgingRoomTypeVo> roomType(int no);

    @Select("""
            SELECT
                NO
                ,ROOM_TYPE_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,PATH
                ,ORDER_NO
                ,UPLOAD_DATE
                ,DEL_YN
            FROM
                ATTACHMENT_ROOM_TYPE
            WHERE
                ROOM_TYPE_NO = #{no}
            AND
                DEL_YN = 'N'
            """)
    List<LodgingRoomTypeAttachVo> RoomTypeAttach(int no);

    @Select("""
        SELECT
            LR.NO,
            LR.MEMBER_NO,
            LR.RESERVATE_NO,
            LR.LODGING_NO,
            LR.CONTENT,
            LR.SCORE,
            LR.ENROLL_DATE,
            LR.MODIFY_DATE,
            LR.DEL_YN,
            M.NAME AS MEMBER_NAME
        FROM
            LODGING_REVIEW LR
        LEFT JOIN
            MEMBER M ON LR.MEMBER_NO = M.NO
        WHERE
            LR.LODGING_NO = #{lodgingNo}
            AND LR.DEL_YN = 'N'
        """)
    List<LodgingReviewVo> reviews(int no);

    @Select("""
            SELECT
                NO
                ,REVIEW_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,PATH
                ,ORDER_NO
                ,UPLOAD_DATE
                ,DEL_YN
            FROM
                ATTACHMENT_LODGING_REVIEW
            WHERE
                REVIEW_NO = #{no}
                AND DEL_YN = 'N'
            """)
    List<LodgingReviewAttachmentVo> reviewsAttach(int no);

    @Select("""
            SELECT
                LR.NO,
                LR.MEMBER_NO,
                LR.RESERVATE_NO,
                LR.LODGING_NO,
                LR.CONTENT,
                LR.SCORE,
                LR.ENROLL_DATE,
                LR.MODIFY_DATE,
                LR.DEL_YN,
                M.NAME AS MEMBER_NAME,
                AL.REVIEW_NO AS ATTACHMENT_REVIEW_NO,
                AL.PATH,
                AL.ORDER_NO
            FROM
                LODGING_REVIEW LR
            LEFT JOIN
                MEMBER M ON LR.MEMBER_NO = M.NO
            LEFT JOIN
                ATTACHMENT_LODGING_REVIEW AL ON LR.NO = AL.REVIEW_NO
            WHERE
                LR.LODGING_NO = #{lodgingNo}
                AND LR.DEL_YN = 'N'
            """)
    List<LodgingReviewDetailedVo> reviewList(int no);


    // 숙소 찜하깅
    @Insert("""
               INSERT INTO SAVED_LODGING(
                NO
                ,MEMBER_NO
                ,LODGING_NO
            )VALUES(
                SEQ_SAVED_LODGING.NEXTVAL
                ,#{memberNo}
                ,#{lodgingNo}
            )
            """)
    void favorite(LodgingSavedVo vo);

    // 찜 삭제~~
    @Delete("""
        DELETE FROM SAVED_LODGING
        WHERE MEMBER_NO = #{memberNo}
        AND LODGING_NO = #{lodgingNo}
       """)
    int favoriteDelete(@Param("memberNo") int memberNo, @Param("lodgingNo") int lodgingNo);


    @Select("""
            SELECT
                  L.NO,
                  L.NAME,
                  L.ROAD_ADDRESS,
                  L.TAG,
                  L.REGION_NO,
                  R.NAME AS REGION_NAME,
                  NVL(MIN(RT.PRICE), 0) AS LOWESTPRICE,
                  NVL(AVG(LR.SCORE), 0) AS AVERAGESCORE,
                  AL.PATH
              FROM
                  LODGING L
              LEFT JOIN
                  ROOM_TYPE RT ON L.NO = RT.LODGING_NO
              LEFT JOIN
                  RESERVATION_LODGING RL ON L.NO = RL.LODGING_NO
              LEFT JOIN
                  LODGING_REVIEW LR ON RL.RESERVATION_NO = LR.RESERVATE_NO
              LEFT JOIN
                  ATTACHMENT_LODGING AL
                  ON L.NO = AL.LODGING_NO
                  AND AL.ORDER_NO = 1
              LEFT JOIN REGION R
                 ON L.REGION_NO = R.NO
              WHERE
                  L.DEL_YN = 'N'
              GROUP BY
                  L.NO, L.NAME, L.ROAD_ADDRESS, L.REGION_NO, L.TAG, L.ENROLL_DATE, R.NAME ,AL.PATH
              ORDER BY
                  AVERAGESCORE DESC
              FETCH FIRST 4 ROWS ONLY
            """)
    List<LodgingVo> mainList();
}
