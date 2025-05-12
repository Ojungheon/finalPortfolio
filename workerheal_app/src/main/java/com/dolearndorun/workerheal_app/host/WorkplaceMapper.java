package com.dolearndorun.workerheal_app.host;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface WorkplaceMapper {

    @Select("""
            SELECT             BUSINESS_TYPE,              
                               BUSINESS_NAME,              
                               BUSINESS_ADDRESS,           
                               BUSINESS_ADDRESS_DETAIL,    
                               BUSINESS_CAPACITY,          
                               BUSINESS_REGION,            
                               BUSINESS_NO,
                               BUSINESS_DATE
                        FROM (
                          SELECT
                              '오피스' AS BUSINESS_TYPE,
                              O.NAME AS BUSINESS_NAME,
                              O.ROAD_ADDRESS AS BUSINESS_ADDRESS,
                              O.DETAIL_ADDRESS AS BUSINESS_ADDRESS_DETAIL,
                              O.CAPACITY AS BUSINESS_CAPACITY,
                              R.NAME AS BUSINESS_REGION,
                              O.NO AS BUSINESS_NO,
                              O.ENROLL_DATE AS BUSINESS_DATE
                          FROM OFFICE O
                          JOIN REGION R ON O.REGION_NO = R.NO
               
                          UNION ALL
                       
                          SELECT
                              '숙소' AS BUSINESS_TYPE,
                              L.NAME AS BUSINESS_NAME,
                              L.ROAD_ADDRESS AS BUSINESS_ADDRESS,
                              L.DETAIL_ADDRESS AS BUSINESS_ADDRESS_DETAIL,
                              NULL AS BUSINESS_CAPACITY,
                              R.NAME AS BUSINESS_REGION,
                              L.NO AS BUSINESS_NO,
                              L.ENROLL_DATE AS BUSINESS_DATE
                          FROM LODGING L
                          JOIN REGION R ON L.REGION_NO = R.NO
                        )
                        ORDER BY BUSINESS_DATE DESC
            """)
    List<WorkplaceVo> sellect();

    @Select("""
            SELECT\s
                RESERVATION_ID,
                USER_ID,
                STATUS,
                PLACE_NO,
                GUEST_COUNT,
                TOTAL_PRICE,
                EXTRA_CODE,
                CHECKIN_DATE,
                CHECKOUT_DATE,
                BOOKING_DATE,
                PACKAGE_YN,
                PLACE_TYPE,
                PLACE_NAME,
                RESERVE_NAME,
                RESERVE_PHONE
            FROM (
                SELECT\s
                    RL.RESERVATION_NO AS RESERVATION_ID,
                    RL.MEMBER_NO AS USER_ID,
                    RL.RESERVATE_STATUS AS STATUS,
                    RL.LODGING_NO AS PLACE_NO,\s
                    RL.RESERVATE_NUM AS GUEST_COUNT,
                    RL.PRICE AS TOTAL_PRICE,
                    NULL AS EXTRA_CODE,\s
                    RL.START_DATE AS CHECKIN_DATE,
                    RL.END_DATE AS CHECKOUT_DATE,
                    RL.RESERVATE_DATE AS BOOKING_DATE,
                    RL.IS_PACKAGE AS PACKAGE_YN,
                    '숙소' AS PLACE_TYPE,
                    L.NAME AS PLACE_NAME,
                    M.NAME AS RESERVE_NAME,
                    M.PHONE AS RESERVE_PHONE
                   \s
                FROM RESERVATION_LODGING RL
                JOIN LODGING L ON RL.LODGING_NO = L.NO
                JOIN MEMBER M ON RL.MEMBER_NO = M.NO
            
                UNION
            
                SELECT\s
                    RO.RESERVATION_NO AS RESERVATION_ID,
                    RO.MEMBER_NO AS USER_ID,
                    RO.RESERVATE_STATUS AS STATUS,
                    RO.OFFICE_NO AS PLACE_NO, \s
                    RO.RESERVATE_NUM AS GUEST_COUNT,
                    RO.PRICE AS TOTAL_PRICE,
                    RO.EXTRA_CODE AS EXTRA_CODE,\s
                    RO.START_DATE AS CHECKIN_DATE,
                    RO.END_DATE AS CHECKOUT_DATE,
                    RO.RESERVATE_DATE AS BOOKING_DATE,
                    RO.IS_PACKAGE AS PACKAGE_YN,
                    '오피스' AS PLACE_TYPE,
                    O.NAME AS PLACE_NAME,
                    M.NAME AS RESERVE_NAME,
                    M.PHONE AS RESERVE_PHONE
                FROM RESERVATION_OFFICE RO
                JOIN OFFICE O ON RO.OFFICE_NO = O.NO
                JOIN MEMBER M ON RO.MEMBER_NO = M.NO
            )
            """)
    List<WorkplaceReserveVo> sellectReserve();

    @Select("""
            SELECT BUSINESS_TYPE, BUSINESS_NAME, BUSINESS_ADDRESS, BUSINESS_ADDRESS_DETAIL, BUSINESS_CAPACITY, BUSINESS_REQUEST_STATUS, BUSINESS_REGION , BUSINESS_DATE , BUSINESS_NO
            FROM (
              SELECT
                  '오피스' AS BUSINESS_TYPE,
                  O.NAME AS BUSINESS_NAME,
                  O.ROAD_ADDRESS AS BUSINESS_ADDRESS,
                  O.DETAIL_ADDRESS AS BUSINESS_ADDRESS_DETAIL,
                  O.CAPACITY AS BUSINESS_CAPACITY,
                  RS.NAME AS BUSINESS_REQUEST_STATUS,
                  R.NAME AS BUSINESS_REGION,
                  O.CREATE_DATE AS BUSINESS_DATE,
                  O.NO AS BUSINESS_NO
              FROM TEMP_OFFICE O
              JOIN REQUEST_STATUS RS ON O.STATUS_NO = RS.NO
              JOIN REGION R ON O.REGION_NO = R.NO
            
              UNION ALL
             
              SELECT
                  '숙소' AS BUSINESS_TYPE,
                  L.NAME AS BUSINESS_NAME,
                  L.ROAD_ADDRESS AS BUSINESS_ADDRESS,
                  L.DETAIL_ADDRESS AS BUSINESS_ADDRESS_DETAIL,
                  NULL AS BUSINESS_CAPACITY,
                  RS.NAME AS BUSINESS_REQUEST_STATUS,
                  R.NAME AS BUSINESS_REGION,
                  L.CREATE_DATE AS BUSINESS_DATE,
                  L.NO AS BUSINESS_NO
              FROM TEMP_LODGING L
              JOIN REQUEST_STATUS RS ON L.STATUS_NO = RS.NO
              JOIN REGION R ON L.REGION_NO = R.NO
            )
            ORDER BY BUSINESS_DATE DESC
            
            """)
    List<WorkplaceTempVo> tempSelect();

    @Select("""
            SELECT
                RL.RESERVATION_NO
                ,RL.MEMBER_NO
                ,RL.RESERVATE_STATUS
                ,RL.LODGING_NO
                ,RL.RESERVATE_NUM
                ,RL.PRICE
                ,RL.START_DATE
                ,RL.END_DATE
                ,RL.RESERVATE_DATE
                ,RL.IS_PACKAGE
                ,M.NAME
                ,M.PHONE
            FROM RESERVATION_LODGING RL
            LEFT JOIN LODGING L ON RL.LODGING_NO = L.NO
            JOIN MEMBER M ON RL.MEMBER_NO = M.NO
            WHERE RL.LODGING_NO = #{lodgingNo}
            """)
    List<LodgingReserveVo> selectLReserveList(int lodgingNo);

    @Select("""
            SELECT
                RO.RESERVATION_NO,
                RO.MEMBER_NO,
                RO.RESERVATE_STATUS,
                RO.OFFICE_NO,
                RO.RESERVATE_NUM,
                RO.PRICE,
                RO.EXTRA_CODE,
                RO.START_DATE,
                RO.END_DATE,
                RO.RESERVATE_DATE,
                RO.IS_PACKAGE,
                M.NAME,
                M.PHONE
            FROM RESERVATION_OFFICE RO
            LEFT JOIN OFFICE O ON RO.OFFICE_NO = O.NO
            JOIN MEMBER M ON RO.MEMBER_NO = M.NO
            WHERE RO.OFFICE_NO = #{officeNo}
            """)
    List<OfficeReserveVo> selectOReserveList(int officeNo);

    @Select("""
            SELECT
                 M.NAME  as memberName
                ,M.NICK as memberNick
                ,M.PHONE as memberPhone
                ,M.ID   as memberEmail
                ,RO.MEMBER_NO
                ,RO.START_DATE
                ,RO.END_DATE
                ,RO.PRICE
                ,RO.RESERVATE_NUM
                ,RO.RESERVATION_NO
                ,PY.PAY_TYPE
                FROM RESERVATION_OFFICE RO
                JOIN MEMBER M
                ON RO.MEMBER_NO = M.NO
                JOIN PAYMENT PY
                ON M.NO = PY.MEMBER_NO
                WHERE RO.RESERVATION_NO = #{reservationNo}
            """)
    OfficeReserveVo selectOrReserveDetail(int reservationNo);
}
