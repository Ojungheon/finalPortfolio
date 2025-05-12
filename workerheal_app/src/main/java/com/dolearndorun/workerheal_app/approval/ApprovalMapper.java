package com.dolearndorun.workerheal_app.approval;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ApprovalMapper {

    // 사업장 요청 목록 조회
    @Select("""
            SELECT
            *
            FROM (
                SELECT
                O.HOST_NO
                , H.NAME AS HOST_NAME 
                , O.REGION_NO
                , R.NAME AS REGION_NAME
                , O.NO
                , O.NAME AS PLACE_NAME
                , 'office' AS PLACE_TYPE
                , '오피스' AS PLACE_TYPE_NAME
                , O.STATUS_NO
                , RS.NAME AS STATUS_NAME
                , O.BUSINESS_NO
                , O.CREATE_DATE
                FROM TEMP_OFFICE O
                JOIN HOST H ON (O.HOST_NO = H.NO)
                JOIN REGION R ON (O.REGION_NO = R.NO)
                JOIN REQUEST_STATUS RS ON (O.STATUS_NO = RS.NO)
            
                UNION ALL            
            
                SELECT
                L.HOST_NO
                , H.NAME AS HOST_NAME
                , L.REGION_NO
                , R.NAME AS REGION_NAME
                , L.NO
                , L.NAME AS PLACE_NAME
                , 'lodging' AS PLACE_TYPE
                , '숙소' AS PLACE_TYPE_NAME
                , L.STATUS_NO
                , RS.NAME AS STATUS_NAME
                , L.BUSINESS_NO
                , L.CREATE_DATE
                FROM TEMP_LODGING L
                JOIN HOST H ON (L.HOST_NO = H.NO)
                JOIN REGION R ON (L.REGION_NO = R.NO)
                JOIN REQUEST_STATUS RS ON (L.STATUS_NO = RS.NO)
            )
            ORDER BY CREATE_DATE DESC
            OFFSET #{offSet} ROWS FETCH NEXT #{limit} ROWS ONLY
            """)
    List<ApprovalVo> approvalListByPageNo(int offSet, int limit);

    // 등록된 총 사업장 요청 수량 확인 - 태훈
    @Select("""
            SELECT
            COUNT(NO)
            FROM (
                SELECT
                NO
                FROM TEMP_OFFICE
                UNION ALL
                SELECT
                NO
                FROM TEMP_LODGING
            )
            """)
    long totalApprovalCnt();

    // 오피스 요청 상세 조회 by No
    @Select("""
            SELECT
                O.NO
                , O.HOST_NO
                , H.NAME AS HOST_NAME
                , O.OFFICE_NO
                , O.REGION_NO
                , R.NAME AS REGION_NAME
                , O.STATUS_NO
                , O.BUSINESS_NO
                , O.NAME
                , O.PHONE
                , O.DETAIL
                , O.PRICE
                , O.CAPACITY
                , O.OPEN
                , O.CLOSE
                , O.FACILITIE_CODE
                , O.EXTRA_CODE
                , O.TAG
                , O.SCORE
                , O.POSTCODE
                , O.ROAD_ADDRESS
                , O.DETAIL_ADDRESS
                , O.CREATE_DATE
            FROM TEMP_OFFICE O
            JOIN HOST H ON (O.HOST_NO = H.NO)
            JOIN REGION R ON (O.REGION_NO = R.NO)
            WHERE O.NO = #{no}
            """)
    TempOfficeVo getTempOfficeDetailByNo(String no);

    // 오피스 요청 첨부파일 목록 조회 by No
    @Select("""
            SELECT
            NO
            , OFFICE_NO AS PLACE_NO
            , ORIGIN_NAME
            , CHANGE_NAME
            , PATH
            , ORDER_NO
            , UPLOAD_DATE
            , DEL_YN
            FROM ATTACHMENT_TEMP_OFFICE
            WHERE OFFICE_NO = #{no}
            AND DEL_YN = 'N'
            ORDER BY ORDER_NO ASC
            """)
    List<TempAttachmentVo> getTempOfficeAttachmentListByNo(String no);

    // 숙소 요청 상세 조회 by No
    @Select("""
            SELECT
                L.NO
                , L.HOST_NO
                , H.NAME AS HOST_NAME
                , L.LODGING_NO
                , L.REGION_NO
                , R.NAME AS REGION_NAME
                , L.TYPE_NO
                , LT.NAME AS TYPE_NAME
                , L.STATUS_NO
                , L.BUSINESS_NO
                , L.NAME
                , L.PHONE
                , L.DETAIL
                , L.FACILITIE_CODE
                , L.TAG
                , L.SCORE
                , L.POSTCODE
                , L.ROAD_ADDRESS
                , L.DETAIL_ADDRESS
                , L.CREATE_DATE
            FROM TEMP_LODGING L
            JOIN HOST H ON (L.HOST_NO = H.NO)
            JOIN REGION R ON (L.REGION_NO = R.NO)
            JOIN LODGING_TYPE LT ON (L.TYPE_NO = LT.NO)
            WHERE L.NO = #{no}
            """)
    TempLodgingVo getTempLodgingDetailByNo(String no);

    // 숙소 요청 첨부파일 목록 조회 by No
    @Select("""
            SELECT
            NO
            , LODGING_NO AS PLACE_NO
            , ORIGIN_NAME
            , CHANGE_NAME
            , PATH
            , ORDER_NO
            , UPLOAD_DATE
            , DEL_YN
            FROM ATTACHMENT_TEMP_LODGING
            WHERE LODGING_NO = #{no}
            AND DEL_YN = 'N'
            ORDER BY ORDER_NO ASC
            """)
    List<TempAttachmentVo> getTempLodgingAttachmentListByNo(String no);

    // 숙소 별 객실정보 목록 조회 by lodging_no
    @Select("""
            SELECT
                RT.NO
                , RT.ROOM_TYPE_NO
                , RT.LODGING_NO
                , RT.STATUS_NO
                , RT.NAME
                , RT.PRICE
                , RT.SLEEPS
                , RT.AMOUNT
                , RT.FACILITIE_CODE
                , RT.SINGLE_BED
                , RT.DOUBLE_BED
                , RT.CHECK_IN
                , RT.CHECK_OUT
                , RT.CREATE_DATE
            FROM TEMP_ROOM_TYPE RT
            WHERE RT.LODGING_NO = #{no}
            """)
    List<TempRoomTypeVo> getTempRoomTypeByNo(String no);

    // 숙소 별 객실정보 첨부파일 목록 조회 by room_type_no
    @Select("""
            SELECT
            NO
            , ROOM_TYPE_NO AS PLACE_NO
            , ORIGIN_NAME
            , CHANGE_NAME
            , PATH
            , ORDER_NO
            , UPLOAD_DATE
            , DEL_YN
            FROM ATTACHMENT_TEMP_ROOM_TYPE
            WHERE ROOM_TYPE_NO = #{no}
            AND DEL_YN = 'N'
            ORDER BY ORDER_NO ASC
            """)
    List<TempAttachmentVo> getTempRoomTypeAttachmentListByNo(Long no);
    
    // 요청 항목 반려 처리
    int denyApproval(String no, String place);

    // 등록요청 항목 승인 처리 - 사업장 정보 임시 테이블에서 본 테이블로 이전(오피스)
    @Insert("""
            INSERT INTO OFFICE
            (
                NO
                , HOST_NO
                , REGION_NO
                , BUSINESS_NO
                , NAME
                , PHONE
                , DETAIL
                , PRICE
                , CAPACITY
                , OPEN
                , CLOSE
                , FACILITIE_CODE
                , EXTRA_CODE
                , TAG
                , SCORE
                , POSTCODE
                , ROAD_ADDRESS
                , DETAIL_ADDRESS
                , ENROLL_DATE
                , MODIFY_DATE
            )
            SELECT         
            SEQ_OFFICE.NEXTVAL
            , HOST_NO
            , REGION_NO
            , BUSINESS_NO
            , NAME
            , PHONE
            , DETAIL
            , PRICE
            , CAPACITY
            , OPEN
            , CLOSE
            , FACILITIE_CODE
            , EXTRA_CODE
            , TAG
            , SCORE
            , POSTCODE
            , ROAD_ADDRESS
            , DETAIL_ADDRESS
            , SYSDATE
            , SYSDATE
            FROM TEMP_OFFICE
            WHERE NO = #{no}
            """)
    int enrollOfficeInfo(String no);
    
    // 수정요청 항목 승인 처리 - 사업장 정보 임시 테이블에서 본 테이블로 이전(오피스)
    int updateOfficeInfo(String no);

    // 등록요청 항목 승인 처리 - 사업장 정보 임시 테이블에서 본 테이블로 이전(숙소)
    @Insert("""
            INSERT INTO LODGING
            (
                NO
                , HOST_NO
                , REGION_NO
                , TYPE_NO
                , BUSINESS_NO
                , DETAIL
                , NAME
                , PHONE
                , FACILITIE_CODE
                , TAG
                , SCORE
                , POSTCODE
                , ROAD_ADDRESS
                , DETAIL_ADDRESS
                , ENROLL_DATE
                , MODIFY_DATE
            )
            SELECT
                SEQ_LODGING.NEXTVAL
                , HOST_NO
                , REGION_NO
                , TYPE_NO
                , BUSINESS_NO
                , DETAIL
                , NAME
                , PHONE
                , FACILITIE_CODE
                , TAG
                , SCORE
                , POSTCODE
                , ROAD_ADDRESS
                , DETAIL_ADDRESS
                , SYSDATE
                , SYSDATE
            FROM TEMP_LODGING
            WHERE NO = #{no}
            """)
    int enrollLodgingInfo(String no);
    
    // 수정요청 항목 승인 처리 - 사업장 정보 임시 테이블에서 본 테이블로 이전(숙소)
    int updateLodgingInfo(String no);

    // 등록요청 항목 승인 처리 - 사업장 정보 임시 테이블에서 본 테이블로 이전(객실)
    @Insert("""
            INSERT INTO ROOM_TYPE
            (
                NO
                , LODGING_NO
                , NAME
                , PRICE
                , SLEEPS
                , FACILITIE_CODE
                , AMOUNT
                , SINGLE_BED
                , DOUBLE_BED
                , CHECK_IN
                , CHECK_OUT
                , ENROLL_DATE
                , MODIFY_DATE
            )
            SELECT
                SEQ_ROOM_TYPE.NEXTVAL
                , SEQ_LODGING.CURRVAL
                , NAME
                , PRICE
                , SLEEPS
                , FACILITIE_CODE
                , AMOUNT
                , SINGLE_BED
                , DOUBLE_BED
                , CHECK_IN
                , CHECK_OUT
                , SYSDATE
                , SYSDATE
            FROM TEMP_ROOM_TYPE
            WHERE LODGING_NO = #{no}
            """)
    int enrollRoomTypeInfo(String no);

    // 요청 항목 승인 처리 - 사업장 첨부파일 정보 임시 테이블에서 본 테이블로 이전
    int acceptWorkplaceAttachment(String no, String place);

    // 임시 테이블에서 승인 처리 된 사업장 정보 삭제
    int deleteWorkplaceInfo(String no, String place);

    // 임시 테이블에서 승인 처리 된 사업장 첨부파일 삭제
    int deleteTempAttachment(String no,String place);

    // 본 테이블에서 기존 첨부파일 삭제
    int deleteBeforeAttachment(String no, String place);

    @Insert("""
        INSERT INTO ATTACHMENT_ROOM_TYPE
        (
            NO
            , ROOM_TYPE_NO
            , ORIGIN_NAME
            , CHANGE_NAME
            , PATH
            , ORDER_NO
            , UPLOAD_DATE
        )
        SELECT
            SEQ_ATTACHMENT_ROOM_TYPE.NEXTVAL
            , #{roomTypeNo}
            , ORIGIN_NAME
            , CHANGE_NAME
            , PATH
            , ORDER_NO
            , UPLOAD_DATE
        FROM ATTACHMENT_TEMP_ROOM_TYPE
        WHERE ROOM_TYPE_NO = #{tempNo}
        """)
    int acceptRoomTypeAttachment(String tempNo , String roomTypeNo);

    // 객식 유형 본 테이블 이전 후 마지막 SEQ 값 확인
    @Select("""
            SELECT SEQ_ROOM_TYPE.CURRVAL FROM DUAL
            """)
    int getRoomTypeSeq();

    @Select("""
            SELECT
            NO
            FROM TEMP_ROOM_TYPE
            WHERE LODGING_NO = #{no}
            ORDER BY NO
            """)
    List<Integer> getTempRoomTypeNo(String no);
    
}//class
