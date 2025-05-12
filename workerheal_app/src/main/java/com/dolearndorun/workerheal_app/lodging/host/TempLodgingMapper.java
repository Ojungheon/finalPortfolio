package com.dolearndorun.workerheal_app.lodging.host;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TempLodgingMapper {


    @Select("""
            SELECT
              NO,
              HOST_NO,
              LODGING_NO,
              REGION_NO,
              TYPE_NO,
              STATUS_NO,
              BUSINESS_NO,
              NAME,
              PHONE,
              FACILITIE_CODE,
              TAG,
              SCORE,
              POSTCODE,
              ROAD_ADDRESS,
              DETAIL_ADDRESS,
              CREATE_DATE
            FROM TEMP_LODGING
            """)
    List<TempLodgingVo> findAll(int pno, int limit);

    @Insert("""
            INSERT INTO TEMP_LODGING
            (
                 NO
                ,HOST_NO
                ,REGION_NO
                ,TYPE_NO
                ,STATUS_NO
                ,BUSINESS_NO
                ,DETAIL
                ,NAME
                ,PHONE
                ,FACILITIE_CODE
                ,TAG
                ,SCORE
                ,POSTCODE
                ,ROAD_ADDRESS
                ,DETAIL_ADDRESS
                ,CREATE_DATE
            )
            VALUES
            (
                #{no}
                ,#{hostNo}
                ,#{regionNo}
                ,#{typeNo}
                ,#{statusNo}
                ,#{businessNo}
                ,#{detail}
                ,#{name}
                ,#{phone}
                ,#{facilitieCode}
                ,#{tag}
                ,#{score}
                ,#{postCode}
                ,#{roadAddress}
                ,#{detailAddress}
                ,SYSDATE
            )
            """)
    @SelectKey( statement = "SELECT SEQ_TEMP_LODGING.NEXTVAL FROM DUAL",
                keyProperty = "no",
                before = true,
                resultType = Long.class)
    int lodgingEnroll(TempLodgingVo vo);

    @Select("""
            SELECT
                TL.NAME
                ,TL.BUSINESS_NO
                ,R.NAME AS RegionName
                ,LT.NAME AS TypeName
                ,TL.PHONE
                ,TL.POSTCODE
                ,TL.ROAD_ADDRESS
                ,TL.DETAIL_ADDRESS
                ,TL.TAG
                ,TL.FACILITIE_CODE
                ,TL.DETAIL
            FROM TEMP_LODGING TL
            JOIN REGION R
            ON TL.REGION_NO = R.NO
            JOIN LODGING_TYPE LT
            ON TL.TYPE_NO = LT.NO
            WHERE TL.NO = #{no}
            """)
    TempLodgingVo lodgingDetail(int no);

    @Update("""
            UPDATE TEMP_LODGING
            SET
                REGION_NO = #{regionNo},
                TYPE_NO = #{typeNo},
                BUSINESS_NO = #{businessNo},
                NAME = #{name},
                PHONE = #{phone},
                FACILITIE_CODE = #{facilitieCode},
                TAG = #{tag},
                SCORE = #{score},
                POSTCODE = #{postCode},
                ROAD_ADDRESS = #{roadAddress},
                DETAIL_ADDRESS = #{detailAddress}
            WHERE NO = #{no}
            """)
    int updateLodgingByNo(TempLodgingVo vo);



    @Delete("""
            DELETE FROM TEMP_LODGING WHERE NO = #{no}
            """)
    int lodgingDelete(int no);

    // 임시숙소 이미지 등록
    int insertTempLodgingAttachment(@Param("list") List<TempLodgingAttachmentVo> imgVoList, String s);

    @Select("""
                SELECT LODGING_NO, ORIGIN_NAME, CHANGE_NAME, PATH , ORDER_NO
                FROM ATTACHMENT_TEMP_LODGING
                WHERE LODGING_NO = #{no}
            """)
    List<TempLodgingAttachmentVo> lodgingAttachmentDetail(int no);
}
