package com.dolearndorun.workerheal_app.office;

import com.dolearndorun.workerheal_app.packages.ReservationOfficeVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OfficeMapper {

    @Select("""
      SELECT
               O.NO,
               O.NAME AS OFFICE_NAME,
               O.ROAD_ADDRESS AS OFFICE_ADDRESS,
               O.TAG AS OFFICE_TAG,
               O.SCORE,
               O.PRICE AS OFFICE_PRICE,
               O.CAPACITY,
               R.NAME AS REGION_NAME,
               NVL(AVG(R.SCORE), 0) AS AVERAGESCORE,
               COUNT(DISTINCT R.NO) AS REVIEW_COUNT,
               AO.PATH AS ATTACHMENT_PATH,
               O.ENROLL_DATE
           FROM OFFICE O
           LEFT JOIN OFFICE_REVIEW ORV
               ON O.NO = ORV.OFFICE_NO AND ORV.DEL_YN = 'N'
           LEFT JOIN ATTACHMENT_OFFICE AO
               ON O.NO = AO.OFFICE_NO AND AO.DEL_YN = 'N' AND AO.ORDER_NO = 1
           LEFT JOIN OFFICE_REVIEW R
               ON O.NO = R.OFFICE_NO
           LEFT JOIN REGION R
               ON O.REGION_NO = R.NO
           WHERE O.DEL_YN = 'N'
           GROUP BY O.NO, O.NAME, O.ROAD_ADDRESS, O.TAG, O.SCORE, O.PRICE, O.CAPACITY, R.NAME , AO.PATH, O.ENROLL_DATE
           ORDER BY O.ENROLL_DATE DESC
           OFFSET #{offset} ROWS FETCH NEXT #{limit} ROWS ONLY
      """)
    List<OfficeVo> list(int offset, int limit);

    @Select("""
            SELECT
                NO
                ,HOST_NO
                ,REGION_NO
                ,NAME
                ,PHONE
                ,DETAIL
                ,PRICE
                ,CAPACITY
                ,OPEN
                ,CLOSE
                ,FACILITIE_CODE
                ,EXTRA_CODE
                ,TAG
                ,SCORE
                ,POSTCODE
                ,ROAD_ADDRESS
                ,DETAIL_ADDRESS
                ,DEL_YN
            FROM OFFICE
            WHERE
                NO = #{no}
            AND DEL_YN = 'N'
            """)
    OfficeVo officeDetail(int no);

    @Select("""
            SELECT
                NO
                ,OFFICE_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,PATH
                ,ORDER_NO
                ,UPLOAD_DATE
                ,DEL_YN
            FROM ATTACHMENT_OFFICE
            WHERE OFFICE_NO = #{officeNo}
            AND DEL_YN = 'N'
            """)
    List<AttachmentOfficeVo> officeAttach(int no);

    @Select("""
            SELECT
                O.NO,
                O.MEMBER_NO,
                O.RESERVATE_NO,
                O.OFFICE_NO,
                O.CONTENT,
                O.SCORE,
                O.ENROLL_DATE,
                O.MODIFY_DATE,
                O.DEL_YN,
                M.NAME AS MEMBER_NAME
            FROM OFFICE_REVIEW O
            LEFT JOIN MEMBER M ON M.NO = O.MEMBER_NO
            WHERE O.OFFICE_NO = #{officeNo}
            AND O.DEL_YN = 'N'
            """)
    List<OfficeReviewDetailedVo> reviews(int no);

    @Select("""
            SELECT
                 O.NO AS OFFICE_NO,
                 M.NAME AS MEMBER_NAME,
                 R.NO AS REVIEW_NO,
                 R.MEMBER_NO,
                 R.RESERVATE_NO,
                 R.OFFICE_NO,
                 R.CONTENT,
                 R.SCORE,
                 R.ENROLL_DATE,
                 R.MODIFY_DATE,
                 R.DEL_YN AS REVIEW_DEL_YN,
        
                 AOR.NO AS REVIEW_ATTACHMENT_NO,
                 AOR.REVIEW_NO,
                 AOR.ORIGIN_NAME AS REVIEW_ATTACHMENT_ORIGINAL_NAME,
                 AOR.CHANGE_NAME AS REVIEW_ATTACHMENT_SAVED_NAME,
                 AOR.PATH AS REVIEW_ATTACHMENT_PATH,
                 AOR.DEL_YN AS ATTACHMENT_DEL_YN
             FROM
                 OFFICE_REVIEW R
             LEFT JOIN
                 ATTACHMENT_OFFICE_REVIEW AOR
             ON
                 R.NO = AOR.REVIEW_NO
             LEFT JOIN
               MEMBER M
             ON
               R.MEMBER_NO = M.NO
             LEFT JOIN
                 OFFICE O
             ON
                 O.NO = R.OFFICE_NO
             WHERE
                 O.NO = #{no}
             AND R.DEL_YN = 'N'
             AND (AOR.DEL_YN = 'N' OR AOR.DEL_YN IS NULL)
            """)
    List<OfficeReviewVo> reviewList(int no);


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
                ATTACHMENT_OFFICE_REVIEW
            WHERE
                REVIEW_NO = #{reviewNo}
            AND DEL_YN = 'N'
            """)
    List<AttachmentOfficeReviewVo> reviewAttach(Long no);

    // 오피스 예약
    // 태훈 추가 수정 - #{info.officeFacilities}, 코드 #{info.officeExtraCode} 로 수정
    // 태훈 추가 수정 - #{info.price}, 코드  #{reservateVo.price} 로 수정
    // 태훈 추가 수정 - EXTRA_CODE, #{info.officeExtraCode}, 코드 삭제
    // 태훈 추가 수정 -'OF' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(SEQ_RESERVATION_OFFICE.NEXTVAL), 3, '0'), 코드 #{reservateVo.reservationNo}, 로 수정
    @Insert("""
    INSERT INTO RESERVATION_OFFICE (
        RESERVATION_NO,
        MEMBER_NO,
        RESERVATE_STATUS,
        OFFICE_NO,
        RESERVATE_NUM,
        PRICE,
        START_DATE,
        END_DATE,
        RESERVATE_DATE,
        IS_PACKAGE
    ) VALUES (
        #{reservateVo.reservationNo},
        #{reservateVo.memberNo},
        'R',
        #{info.no},
        #{reservateVo.reservateNum},
        #{reservateVo.price},
        TO_DATE(SUBSTR(#{reservateVo.startDate}, 1, 10), 'YYYY-MM-DD'),
        TO_DATE(SUBSTR(#{reservateVo.endDate}, 1, 10), 'YYYY-MM-DD'),
        SYSDATE,
        'N'
    )
    """)
    int officeReservation(OfficeDetailedVo info, ReservationOfficeVo reservateVo);

    // 오피스 추가 물품
    // 태훈 수정 -  'OF' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(SEQ_RESERVATION_OFFICE.CURRVAL), 3, '0'), 코드
    @Select("""
            INSERT INTO EXTRA_FACILITE(
                NO,
                OFFICE_RESERVATE_NO,
                FACILITE_CODE,
                AMOUNT
            )VALUES(
                SEQ_EXTRA_FACILITE.NEXTVAL,
                #{reservationNo},
                #{faciliteCode},
                #{amount}
            )
            """)
//    void officeFacilite(ReservationOfficeVo reservation); // 태훈 수정
    void officeFacilite(String reservationNo, String faciliteCode,int amount);

    @Select("""
            SELECT
            RESERVATION_NO
            FROM RESERVATION_OFFICE
            WHERE RESERVATE_STATUS = 'R'
            ORDER BY RESERVATION_NO DESC
            """)
    List<String> getCurrentReservationNo(); // 태훈 추가

    @Insert("""
            INSERT INTO SAVED_OFFICE(
                NO
                ,MEMBER_NO
                ,OFFICE_NO
            )VALUES(
                SEQ_SAVED_OFFICE.NEXTVAL
                ,#{memberNo}
                ,#{officeNo}
            )
            """)
    void favorite(OfficeSavedVo vo);

    @Delete("""
            DELETE
            FROM SAVED_OFFICE
            WHERE MEMBER_NO = #{memberNo}
            AND OFFICE_NO = #{officeNo}
            """)
    int favoriteDelete(@Param("memberNo") int memberNo, @Param("officeNo") int officeNo);

    @Select("""
            SELECT
               O.NO,
               O.NAME AS OFFICE_NAME,
               O.ROAD_ADDRESS AS OFFICE_ADDRESS,
               O.TAG AS OFFICE_TAG,
               O.SCORE,
               O.PRICE AS OFFICE_PRICE,
               AO.PATH AS ATTACHMENT_PATH
           FROM OFFICE O
           LEFT JOIN ATTACHMENT_OFFICE AO
               ON O.NO = AO.OFFICE_NO AND AO.DEL_YN = 'N' AND AO.ORDER_NO = 1
           WHERE O.DEL_YN = 'N'
           ORDER BY O.SCORE DESC
           FETCH FIRST 4 ROWS ONLY
           """)
    List<OfficeVo> mainList();
}
