package com.dolearndorun.workerheal_app.office.host;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TempOfficeMapper {

    @Insert("""
            INSERT INTO TEMP_OFFICE
            (
                NO,
                HOST_NO,
                REGION_NO,
                STATUS_NO,
                BUSINESS_NO,
                NAME,
                PHONE,
                DETAIL,
                PRICE,
                CAPACITY,
                OPEN,
                CLOSE,
                FACILITIE_CODE,
                TAG,
                SCORE,
                POSTCODE,
                ROAD_ADDRESS,
                DETAIL_ADDRESS,
                CREATE_DATE
            )
            VALUES
            (
                #{no},
                #{hostNo},
                #{regionNo},
                #{statusNo},
                #{businessNo},
                #{name},
                #{phone},
                #{detail},
                #{price},
                #{capacity},
                #{open},
                #{close},
                #{facilitieCode},
                #{tag},
                #{score},
                #{postCode},
                #{roadAddress},
                #{detailAddress},
                SYSDATE
            )
            """)
    @SelectKey( statement = "SELECT SEQ_TEMP_OFFICE.NEXTVAL FROM DUAL",
                keyProperty = "no",
                before = true,
                resultType = Long.class)
    int officeEnroll(TempOfficeVo vo);

    @Update("""
            UPDATE TEMP_OFFICE
            SET
                REGION_NO = #{regionNo},
                BUSINESS_NO = #{businessNo},
                NAME = #{name},
                PHONE = #{phone},
                DETAIL = #{detail},
                PRICE = #{price},
                CAPACITY = #{capacity},
                OPEN = #{open},
                CLOSE = #{close},
                FACILITIE_CODE = #{facilitieCode},
                TAG = #{tag},
                SCORE = #{score},
                POSTCODE = #{postCode},
                ROAD_ADDRESS = #{roadAddress},
                DETAIL_ADDRESS = #{detailAddress},
                CREATE_DATE = SYSDATE
            WHERE
                NO = #{no}
            """)
    int updateOfficeByNo(TempOfficeVo vo);

    @Delete("""
            DELETE FROM TEMP_OFFICE WHERE NO = #{no}
            """)
    int officeDelete(int no);

    // 임시오피스 이미지 등록
    int insertTempOfficeAttachment(@Param("list") List<TempOfficeAttachmentVo> imgVoList, String s);

    @Select("""
            SELECT
                TF.NAME
                ,TF.BUSINESS_NO
                ,TF.PRICE
                ,R.NAME AS RegionName
                ,TF.CAPACITY
                ,TF.OPEN
                ,TF.CLOSE
                ,TF.POSTCODE
                ,TF.ROAD_ADDRESS
                ,TF.DETAIL_ADDRESS
                ,TF.TAG
                ,TF.FACILITIE_CODE
                ,TF.DETAIL
                ,TF.PHONE
            FROM TEMP_OFFICE TF
            JOIN REGION R
            ON TF.REGION_NO = R.NO
            WHERE TF.NO = #{no}
            """)
    TempOfficeVo officeDetail(int no);

    @Select("""
            SELECT OFFICE_NO, ORIGIN_NAME, CHANGE_NAME, PATH , ORDER_NO
                FROM ATTACHMENT_TEMP_OFFICE
                WHERE OFFICE_NO = #{no}
            """)
    List<TempOfficeAttachmentVo> officeAttachmentDetail(int no);
}
