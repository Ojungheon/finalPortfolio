package com.dolearndorun.workerheal_app.packages.user;

import com.dolearndorun.workerheal_app.lodging.LodgingDetailedVo;
import com.dolearndorun.workerheal_app.lodging.LodgingRoomTypeVo;
import com.dolearndorun.workerheal_app.office.OfficeDetailedVo;
import com.dolearndorun.workerheal_app.packages.*;
import com.dolearndorun.workerheal_app.tour.TourVo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PackagesMapper {
    
    // 목록 조회
    @Select("""
          SELECT
                P.NO,
                P.NAME,
                P.OPEN_DATE,
                P.CLOSE_DATE,
                P.SCORE,
                P.TAG,
                P.DISCOUNT,
                AP.PATH AS ATTACHMENT_PATH,
                AP.ORDER_NO,
                COALESCE(PR.REVIEW_SCORE, 0) AS REVIEW_SCORE,
                COALESCE(PR.REVIEW_COUNT, 0) AS REVIEW_COUNT,
                P.ENROLL_DATE
            FROM PACKAGE P
            LEFT JOIN (
                SELECT
                    PACKAGE_NO,
                    AVG(SCORE) AS REVIEW_SCORE,
                    COUNT(NO) AS REVIEW_COUNT
                FROM PACKAGE_REVIEW
                WHERE DEL_YN = 'N'
                GROUP BY PACKAGE_NO
            ) PR ON P.NO = PR.PACKAGE_NO
            LEFT JOIN ATTACHMENT_PACKAGE AP
                ON P.NO = AP.PACKAGE_NO AND AP.ORDER_NO = 1
            WHERE P.DEL_YN = 'N'
            ORDER BY P.ENROLL_DATE DESC
          """)
    List<PackagesVo> packageList(int offset, int limit);

    // 패키지 첨부파일
    @Select("""
            SELECT
                NO
                ,PACKAGE_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,PATH
                ,ORDER_NO
                ,UPLOAD_DATE
                ,DEL_YN
            FROM ATTACHMENT_PACKAGE
            WHERE PACKAGE_NO = #{packageNo}
            AND DEL_YN ='N'
            """)
    List<PackagesAttachmentVo> packageAttach(int reviewNo);

    // 패키지 리뷰
    @Select("""
            SELECT
                NO
                ,MEMBER_NO
                ,RESERVATE_NO
                ,PACKAGE_NO
                ,CONTENT
                ,SCORE
                ,ENROLL_DATE
                ,MODIFY_DATE
                ,DEL_YN
            FROM PACKAGE_REVIEW
            WHERE PACKAGE_NO = #{packageNo}
            AND DEL_YN = 'N'
            """)
    List<PackagesReviewVo> reviews(int no);

    //리뷰 첨부파일
    @Select("""
    SELECT
        NO,
        REVIEW_NO,
        ORIGIN_NAME,
        CHANGE_NAME,
        PATH,
        ORDER_NO,
        UPLOAD_DATE,
        DEL_YN
    FROM ATTACHMENT_PACKAGE_REVIEW
    WHERE REVIEW_NO = #{reviewNo}
    AND DEL_YN = 'N'
    """)
    List<PackagesReviewAttachmentVo> reviewsAttach(int reviewNo);

    // 패키지 상세 조회
    @Select("""
            SELECT
                NO
                ,MANAGER_NO
                ,OFFICE_NO
                ,LODGING_NO
                ,TOUR_SPOT_NO
                ,REGION_NO
                ,NAME
                ,DETAIL
                ,DISCOUNT
                ,IS_TEMPORARY
                ,OPEN_DATE
                ,CLOSE_DATE
                ,FINISH_YN
                ,TAG
                ,SCORE
                ,ENROLL_DATE
                ,DEL_YN
            FROM PACKAGE
            WHERE NO = #{no}
            AND DEL_YN = 'N'
            """)
    PackagesVo detail(int no);

    // 오피스 예약
    @Insert("""
            INSERT INTO RESERVATION_OFFICE (
                RESERVATION_NO,
                MEMBER_NO,
                RESERVATE_STATUS,
                OFFICE_NO,
                RESERVATE_NUM,
                PRICE,
                EXTRA_CODE,
                START_DATE,
                END_DATE,
                RESERVATE_DATE,
                IS_PACKAGE
            )VALUES
            (
                'OF' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(GET_SEQ_RESERVATION_OFFICE), 3, '0'),
                #{pack.memberNo},
                'R',
                #{office.no},
                #{pack.reservateNum},
                #{office.price},
                #{office.officeExtraCode},
                TO_DATE(SUBSTR(#{pack.startDate}, 1, 10), 'YYYY-MM-DD'),
                TO_DATE(SUBSTR(#{pack.endDate}, 1, 10), 'YYYY-MM-DD'),
                SYSDATE,
                'Y'
            )
            """)
    int officeReservate(OfficeDetailedVo office, ReservationPackageVo pack);


    // 숙소 예약
    @Insert("""
            INSERT INTO RESERVATION_LODGING (
                RESERVATION_NO
                ,MEMBER_NO
                ,RESERVATE_STATUS
                ,LODGING_NO
                ,RESERVATE_NUM
                ,PRICE
                ,START_DATE
                ,END_DATE
                ,RESERVATE_DATE
                ,IS_PACKAGE
            )VALUES(
               'LO' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(SEQ_RESERVATION_LODGING.NEXTVAL), 3, '0'),
                #{reservatePack.memberNo},
               'R',
               #{lodging.no},
               #{reservatePack.reservateNum},
               #{lodging.price},
                TO_DATE(SUBSTR(#{reservatePack.startDate}, 1, 10), 'YYYY-MM-DD'),
                TO_DATE(SUBSTR(#{reservatePack.endDate}, 1, 10), 'YYYY-MM-DD'),
                SYSDATE,
                'Y'
            )
            """)
    int lodgingReservate(LodgingDetailedVo lodging, ReservationPackageVo reservatePack);

    // 객실 별 예약
    @Insert("""
        INSERT INTO RESERVATION_DETAIL_LODGING
        (
            NO,
            LODGING_RESERVATE_NO,
            ROOM_TYPE_NO,
            ROOM_NUM
        )
        VALUES
        (
            SEQ_RESERVATION_DETAIL_LODGING.NEXTVAL,
            'LO' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(SEQ_RESERVATION_LODGING.CURRVAL), 3, '0'),
            #{no},
            #{amount}
        )
        """)
    int roomTypeReservate(LodgingRoomTypeVo room);

    // 관광프로그램 예약
    @Insert("""
         INSERT INTO RESERVATION_TOUR(
                RESERVATION_NO,
                MEMBER_NO,
                TOUR_NO,
                RESERVATE_STATUS,
                RESERVATE_NUM,
                PRICE,
                START_DATE,
                END_DATE,
                RESERVATE_DATE
            )VALUES(
                'TO' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(SEQ_RESERVATION_TOUR_SPOT.NEXTVAL), 3, '0')
               ,#{pack.memberNo}
                ,#{tour.no}
                ,'R'
                ,#{tourVo.reservateNum}
                ,#{tourVo.price}
                ,TO_DATE(SUBSTR(#{tourVo.startDate}, 1, 10), 'YYYY-MM-DD')
                ,TO_DATE(SUBSTR(#{tourVo.endDate}, 1, 10), 'YYYY-MM-DD')
                ,SYSDATE
            )
         """)
    int tourReservate(@Param("tourVo") ReservationTourVo tourVo, ReservationPackageVo pack, TourVo tour);


    // 패키지 예약
    @Insert("""
            INSERT INTO RESERVATION_PACKAGE(
                RESERVATION_NO,
                MEMBER_NO,
                OFFICE_RESERVATE_NO,
                LODGING_RESERVATE_NO,
                TOUR_RESERVATE_NO,
                PACKAGE_NO,
                RESERVATE_STATUS,
                RESERVATE_NUM,
                PRICE,
                START_DATE,
                END_DATE,
                RESERVATE_DATE
            ) VALUES (
                'PA' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(SEQ_RESERVATION_PACKAGE.NEXTVAL), 3, '0'),
                #{reservatePack.memberNo},
                'OF' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(SEQ_RESERVATION_OFFICE.CURRVAL), 3, '0'),
                'LO' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(SEQ_RESERVATION_LODGING.CURRVAL), 3, '0'),
                'TO' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(SEQ_RESERVATION_TOUR_SPOT.CURRVAL), 3, '0'),
                #{pack.no},
                'R',
                #{reservatePack.reservateNum},
                12345,
                TO_DATE(SUBSTR(#{reservatePack.startDate}, 1, 10), 'YYYY-MM-DD'),
                TO_DATE(SUBSTR(#{reservatePack.endDate}, 1, 10), 'YYYY-MM-DD'),
                SYSDATE
            )
            """)
    int packageReservate(ReservationPackageVo reservatePack, PackagesVo pack);

    // 태훈 추가 - 방금 추가한 오피스 예약의 예약 번호 조회
    @Select("""
            SELECT 
            'OF' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(TO_CHAR(SEQ_RESERVATION_OFFICE.CURRVAL), 3, '0')
            FROM DUAL
            """)
    String currentOfficeReservationNo();


    @Select("""
            SELECT
                P.NO,
                P.NAME,
                P.OPEN_DATE,
                P.CLOSE_DATE,
                P.SCORE,
                P.TAG,
                P.DISCOUNT,
                AP.PATH AS ATTACHMENT_PATH,
                AP.ORDER_NO,
                P.ENROLL_DATE
            FROM PACKAGE P
            LEFT JOIN ATTACHMENT_PACKAGE AP
                ON P.NO = AP.PACKAGE_NO AND AP.ORDER_NO = 1
            WHERE P.DEL_YN = 'N'
            ORDER BY P.SCORE DESC
            """)
    List<PackagesVo> mainList();
}
