package com.dolearndorun.workerheal_app.member.reservated;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReservatedMapper {

    @Select("""
        SELECT
            RL.RESERVATION_NO AS reservationNo,
            L.NAME AS name,
            R.NAME AS region,
            RS.NAME AS status,
            RL.RESERVATE_NUM AS reservateNum,
            RL.PRICE AS price,
            RL.START_DATE AS startDate,
            RL.END_DATE AS endDate,
            A.PATH AS imagePath,
            '숙소' AS productType
        FROM RESERVATION_LODGING RL
        JOIN LODGING L ON RL.LODGING_NO = L.NO
        JOIN REGION R ON L.REGION_NO = R.NO
        JOIN RESERVATE_STATUS RS ON RL.RESERVATE_STATUS = RS.CODE
        LEFT JOIN ATTACHMENT_LODGING A
            ON A.LODGING_NO = L.NO
            AND A.ORDER_NO = 1
            AND A.DEL_YN = 'N'
        WHERE RL.MEMBER_NO = #{memberNo}
          AND L.DEL_YN = 'N'
          AND RL.IS_PACKAGE='N'

        UNION ALL

        SELECT
            RO.RESERVATION_NO AS reservationNo,
            O.NAME AS name,
            R.NAME AS region,
            RS.NAME AS status,
            RO.RESERVATE_NUM AS reservateNum,
            RO.PRICE AS price,
            RO.START_DATE AS startDate,
            RO.END_DATE AS endDate,
            A.PATH AS imagePath,
            '오피스' AS productType
        FROM RESERVATION_OFFICE RO
        JOIN OFFICE O ON RO.OFFICE_NO = O.NO
        JOIN REGION R ON O.REGION_NO = R.NO
        JOIN RESERVATE_STATUS RS ON RO.RESERVATE_STATUS = RS.CODE
        LEFT JOIN ATTACHMENT_OFFICE A
            ON A.OFFICE_NO = O.NO
            AND A.ORDER_NO = 1
            AND A.DEL_YN = 'N'
        WHERE RO.MEMBER_NO = #{memberNo}
          AND O.DEL_YN = 'N'
          AND RO.IS_PACKAGE='N'

        UNION ALL

        SELECT
            RP.RESERVATION_NO AS reservationNo,
            P.NAME AS name,
            R.NAME AS region,
            RS.NAME AS status,
            RP.RESERVATE_NUM AS reservateNum,
            RP.PRICE AS price,
            RP.START_DATE AS startDate,
            RP.END_DATE AS endDate,
            A.PATH AS imagePath,
            '패키지' AS productType
        FROM RESERVATION_PACKAGE RP
        JOIN PACKAGE P ON RP.PACKAGE_NO = P.NO
        JOIN REGION R ON P.REGION_NO = R.NO
        JOIN RESERVATE_STATUS RS ON RP.RESERVATE_STATUS = RS.CODE
        LEFT JOIN ATTACHMENT_PACKAGE A
            ON A.PACKAGE_NO = P.NO
            AND A.ORDER_NO = 1
            AND A.DEL_YN = 'N'
        WHERE RP.MEMBER_NO = #{memberNo}
          AND P.DEL_YN = 'N'

        ORDER BY startDate DESC
    """)
    List<ReservatedVo> getReservatedList(@Param("memberNo") Long memberNo);


    // ✅ 특정 오피스 예약 상세 조회
    @Select("""
        SELECT
           RO.*, O.*, RS.NAME, M.NAME AS memberName, R.NAME AS region
        FROM RESERVATION_OFFICE RO
        JOIN RESERVATE_STATUS RS ON RO.RESERVATE_STATUS = RS.CODE
        JOIN OFFICE O ON RO.OFFICE_NO = O.NO
        JOIN MEMBER M ON RO.MEMBER_NO = M.NO
        JOIN REGION R ON O.REGION_NO = R.NO
        WHERE TRIM(RO.RESERVATION_NO) = TRIM(#{reservationNo})
    """)
    OfficeReservatedVo getOfficeReservatedDetail(@Param("reservationNo") String reservationNo);

    @Select("""
            SELECT
            FACILITE_CODE
            , AMOUNT
            FROM EXTRA_FACILITE
            WHERE OFFICE_RESERVATE_NO = #{reservationNo}
            """)
    List<ExtraFaciliteVo> getOfficeExtraFaciliteList(String reservationNo);

    @Select("""
    SELECT
        RL.*,
        L.*,
        M.NAME AS memberName,
        R.NAME AS region,
        RT.NAME AS roomName,
        RT.FACILITIE_CODE AS roomFaciliteCode,
        RT.CHECK_IN AS checkIn,
        RT.CHECK_OUT AS checkOut,
        BO.NAME AS bed
    FROM RESERVATION_LODGING RL
    JOIN LODGING L ON RL.LODGING_NO = L.NO
    JOIN RESERVATE_STATUS RS ON RL.RESERVATE_STATUS = RS.CODE
    JOIN MEMBER M ON RL.MEMBER_NO = M.NO
    JOIN REGION R ON L.REGION_NO = R.NO
    JOIN RESERVATION_DETAIL_LODGING RD ON RL.RESERVATION_NO = RD.LODGING_RESERVATE_NO
    JOIN ROOM_TYPE RT ON RD.ROOM_TYPE_NO = RT.NO
    JOIN BED_OPTION BO ON RT.NO = BO.ROOM_TYPE_NO
    WHERE TRIM(RL.RESERVATION_NO) = TRIM(#{reservationNo})
    """)
    LodgingReservatedVo getLodgingReservatedDetail(@Param("reservationNo") String reservationNo);

    @Select("""
        SELECT
            P.NAME AS packageName,
            P.DETAIL AS detail,
            P.TAG AS tag,
            RP.START_DATE AS packageStart,
            RP.END_DATE AS packageEnd,
            RP.PRICE AS packagePrice,
            RP.RESERVATION_NO,

            -- 오피스 정보
            O.NAME AS officeName,
            O.PHONE AS officePhone,
            O.POSTCODE AS officeAddress1,
            O.ROAD_ADDRESS AS officeAddress2,
            O.DETAIL_ADDRESS AS officeAddress3,
            O.FACILITIE_CODE AS officeFacilitie,
            RO.START_DATE AS officeStart,
            RO.END_DATE AS officeEnd,
            RO.RESERVATION_NO AS OFFICE_RESERVATION_NO,

            -- 숙소 정보
            L.NAME AS lodgingName,
            L.PHONE AS lodgingPhone,
            L.POSTCODE AS lodgingAddress1,
            L.ROAD_ADDRESS AS lodgingAddress2,
            L.DETAIL_ADDRESS AS lodgingAddress3,
            L.FACILITIE_CODE AS lodgingFacilitie,
            RL.START_DATE AS lodgingStart,
            RL.END_DATE AS lodgingEnd,

            -- 관광지 정보 추가
            T.NAME AS tourSpotName,
            T.ROAD_ADDRESS AS tourSpotAddress,
            T.DETAIL_ADDRESS AS tourSpotDetailAddress,
            RR.START_DATE AS TOUR_START,
            RR.END_DATE AS TOUR_END,
            RR.RESERVATE_NUM AS AMOUNT

        FROM RESERVATION_PACKAGE RP
        LEFT JOIN RESERVATION_LODGING RL ON RP.LODGING_RESERVATE_NO = RL.RESERVATION_NO
        LEFT JOIN RESERVATION_OFFICE RO ON RP.OFFICE_RESERVATE_NO = RO.RESERVATION_NO
        LEFT JOIN RESERVATION_TOUR RR ON RP.TOUR_RESERVATE_NO = RR.RESERVATION_NO
        LEFT JOIN LODGING L ON RL.LODGING_NO = L.NO
        JOIN PACKAGE P ON RP.PACKAGE_NO = P.NO
        LEFT JOIN OFFICE O ON RO.OFFICE_NO = O.NO
        LEFT JOIN TOUR_SPOT T ON RR.TOUR_NO = T.NO
        WHERE TRIM(RP.RESERVATION_NO) = TRIM(#{reservationNo})
    """)
    PackageReservatedVo getPackageReservatedDetail(@Param("reservationNo") String reservationNo);

    //리뷰여부
    @Select("""
    SELECT COUNT(*)
    FROM OFFICE_REVIEW
    WHERE TRIM(RESERVATE_NO) = TRIM(#{reservationNo})
    """)
    int checkOfficeReviewExists(@Param("reservationNo") String reservationNo);

    @Select("""
    SELECT COUNT(*)
    FROM LODGING_REVIEW
    WHERE TRIM(RESERVATE_NO) = TRIM(#{reservationNo})
    """)
    int checkLodgingReviewExists(@Param("reservationNo") String reservationNo);

    @Select("""
    SELECT COUNT(*)
    FROM PACKAGE_REVIEW
    WHERE TRIM(RESERVATE_NO) = TRIM(#{reservationNo})
    """)
    int checkPackageReviewExists(@Param("reservationNo") String reservationNo);

    // 🏢 오피스 리뷰 등록
    @Select("""
    SELECT OFFICE_NO FROM RESERVATION_OFFICE WHERE TRIM(RESERVATION_NO) = TRIM(#{reservationNo})
    """)
    Long findOfficeNoByReservationNo(@Param("reservationNo") String reservationNo);

    @Insert("""
    INSERT INTO OFFICE_REVIEW (
        NO, MEMBER_NO, RESERVATE_NO, OFFICE_NO, CONTENT, SCORE, ENROLL_DATE, DEL_YN
    ) VALUES (
        SEQ_OFFICE_REVIEW.NEXTVAL,
        #{memberNo},
        TRIM(#{reservationNo}),
        #{officeNo},
        #{content},
        #{score},
        SYSDATE,
        'N'
    )
    """)
    int insertOfficeReview(@Param("memberNo") Long memberNo,
                           @Param("reservationNo") String reservationNo,
                           @Param("officeNo") Long officeNo,
                           @Param("content") String content,
                           @Param("score") Long score);


    // 🏨 숙소 리뷰 등록
    @Select("""
    SELECT LODGING_NO FROM RESERVATION_LODGING WHERE TRIM(RESERVATION_NO) = TRIM(#{reservationNo})
    """)
    Long findLodgingNoByReservationNo(@Param("reservationNo") String reservationNo);

    @Insert("""
        INSERT INTO LODGING_REVIEW (
            NO, MEMBER_NO, RESERVATE_NO, LODGING_NO, CONTENT, SCORE, ENROLL_DATE, DEL_YN
        ) VALUES (
            SEQ_LODGING_REVIEW.NEXTVAL,
            #{memberNo},
            TRIM(#{reservationNo}),
            #{lodgingNo},
            #{content},
            #{score},
            SYSDATE,
            'N'
        )
    """)
    int insertLodgingReview(@Param("memberNo") Long memberNo,
                           @Param("reservationNo") String reservationNo,
                           @Param("lodgingNo") Long lodgingNo,
                           @Param("content") String content,
                           @Param("score") Long score);

    // 🎟️ 패키지 리뷰 등록
    @Select("""
    SELECT PACKAGE_NO FROM RESERVATION_PACKAGE WHERE TRIM(RESERVATION_NO) = TRIM(#{reservationNo})
    """)
    Long findPackageNoByReservationNo(@Param("reservationNo") String reservationNo);

    @Insert("""
        INSERT INTO PACKAGE_REVIEW (
            NO, MEMBER_NO, RESERVATE_NO, PACKAGE_NO, CONTENT, SCORE, ENROLL_DATE, DEL_YN
        ) VALUES (
            SEQ_PACKAGE_REVIEW.NEXTVAL,
            #{memberNo},
            TRIM(#{reservationNo}),
            #{packageNo},
            #{content},
            #{score},
            SYSDATE,
            'N'
        )
    """)
    int insertPackageReview(@Param("memberNo") Long memberNo,
                            @Param("reservationNo") String reservationNo,
                            @Param("packageNo") Long packageNo,
                            @Param("content") String content,
                            @Param("score") Long score);

    // 🏢 리뷰 테이블에서 데이터 조회
    @Select("""
    SELECT r.RESERVATE_NO, r.SCORE, r.CONTENT,
           a.ORIGIN_NAME, a.CHANGE_NAME, a.PATH
    FROM OFFICE_REVIEW r
    LEFT JOIN ATTACHMENT_OFFICE_REVIEW a
    ON r.NO = a.REVIEW_NO
    WHERE TRIM(r.RESERVATE_NO) = TRIM(#{reservationNo})
    """)
    ReviewVo findOReviewByReservationNo(@Param("reservationNo") String reservationNo);

    @Select("""
    SELECT r.RESERVATE_NO, r.SCORE, r.CONTENT,
           a.ORIGIN_NAME, a.CHANGE_NAME, a.PATH
    FROM LODGING_REVIEW r
    LEFT JOIN ATTACHMENT_LODGING_REVIEW a
    ON r.NO = a.REVIEW_NO
    WHERE TRIM(r.RESERVATE_NO) = TRIM(#{reservationNo})
    """)
    ReviewVo findLReviewByReservationNo(@Param("reservationNo") String reservationNo);

    @Select("""
    SELECT r.RESERVATE_NO, r.SCORE, r.CONTENT,
           a.ORIGIN_NAME, a.CHANGE_NAME, a.PATH
    FROM PACKAGE_REVIEW r
    LEFT JOIN ATTACHMENT_PACKAGE_REVIEW a
    ON r.NO = a.REVIEW_NO
    WHERE TRIM(r.RESERVATE_NO) = TRIM(#{reservationNo})
    """)
    ReviewVo findPReviewByReservationNo(@Param("reservationNo") String reservationNo);


    //오피스 사진파일 추가
    @Select("""
            SELECT NO FROM OFFICE_REVIEW WHERE RESERVATE_NO = #{reservationNo}
            """)
    Long getOfficeReviewNo(@Param("reservationNo") String reservationNo);

    @Insert("""
    INSERT INTO ATTACHMENT_OFFICE_REVIEW(
        NO, REVIEW_NO, ORIGIN_NAME, CHANGE_NAME, PATH, ORDER_NO, UPLOAD_DATE, DEL_YN
    ) VALUES (
        SEQ_ATTACHMENT_OFFICE_REVIEW.NEXTVAL,
        #{reviewNo},
        #{originName},
        #{changeName},
        #{path},
        #{orderNo},
        SYSDATE,
        'N'
    )
    """)
    int insertOfficeImgFile(AttachmentReviewVo imgVo);

    //숙소 사진파일 추가
    @Select("""
            SELECT NO FROM LODGING_REVIEW WHERE TRIM(RESERVATE_NO) = TRIM(#{reservationNo})
            """)
    Long getLodgingReviewNo(@Param("reservationNo") String reservationNo);

    @Insert("""
    INSERT INTO ATTACHMENT_LODGING_REVIEW(
        NO, REVIEW_NO, ORIGIN_NAME, CHANGE_NAME, PATH, ORDER_NO, UPLOAD_DATE, DEL_YN
    ) VALUES (
        SEQ_ATTACHMENT_LODGING_REVIEW.NEXTVAL,
        #{reviewNo},
        #{originName},
        #{changeName},
        #{path},
        #{orderNo},
        SYSDATE,
        'N'
    )
    """)
    int insertLodgingImgFile(AttachmentReviewVo imgVo);

    //패키지 사진파일 추가
    @Select("""
            SELECT NO FROM Package_REVIEW WHERE TRIM(RESERVATE_NO) = TRIM(#{reservationNo})
            """)
    Long getPackageReviewNo(@Param("reservationNo") String reservationNo);

    @Insert("""
    INSERT INTO ATTACHMENT_PACKAGE_REVIEW(
        NO, REVIEW_NO, ORIGIN_NAME, CHANGE_NAME, PATH, ORDER_NO, UPLOAD_DATE, DEL_YN
    ) VALUES (
        SEQ_ATTACHMENT_PACKAGE_REVIEW.NEXTVAL,
        #{reviewNo},
        #{originName},
        #{changeName},
        #{path},
        #{orderNo},
        SYSDATE,
        'N'
    )
    """)
    int insertPackageImgFile(AttachmentReviewVo imgVo);

}
