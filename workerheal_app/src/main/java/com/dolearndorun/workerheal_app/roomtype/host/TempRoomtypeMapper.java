package com.dolearndorun.workerheal_app.roomtype.host;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TempRoomtypeMapper {

    @Select("""
            SELECT
                NO,
                NAME,
                PRICE,
                SLEEPS,
                AMOUNT,
                SINGLE_BED,
                DOUBLE_BED,
                LODGING_NO
            FROM TEMP_ROOM_TYPE
            WHERE LODGING_NO = #{lodgingNo}
            """)
    List<TempRoomtypeVo> sellect(int lodgingNo);

    @Insert("""
            INSERT INTO TEMP_ROOM_TYPE
            (
                NO
                ,LODGING_NO
                ,STATUS_NO
                ,NAME
                ,PRICE
                ,SLEEPS
                ,SINGLE_BED
                ,DOUBLE_BED
                ,FACILITIE_CODE
                ,AMOUNT
                ,CHECK_IN
                ,CHECK_OUT
                ,CREATE_DATE
             )
            VALUES
            (
                #{no}
                ,#{lodgingNo}
                ,#{statusNo}
                ,#{name}
                ,#{price}
                ,#{sleeps}
                ,#{singleBed}
                ,#{doubleBed}
                ,#{facilitieCode}
                ,#{amount}
                ,#{checkIn}
                ,#{checkOut}
                ,SYSDATE
            )
            """)
    @SelectKey( statement = "SELECT SEQ_TEMP_ROOM_TYPE.NEXTVAL FROM DUAL",
            keyProperty = "no",
            before = true,
            resultType = Long.class)
    int roomTypeEnroll(TempRoomtypeVo vo);

    int insertTempRoomtypeAttachment(@Param("list") List<TempRoomtypeAttachmentVo> imgVoList, String s);

    @Select("""
            SELECT
                NAME
                ,PRICE
                ,SLEEPS
                ,SINGLE_BED
                ,DOUBLE_BED
                ,AMOUNT
                ,CHECK_IN
                ,CHECK_OUT
                ,FACILITIE_CODE
                FROM TEMP_ROOM_TYPE
                WHERE NO = #{no}
            """)
    TempRoomtypeVo roomTypeDetail(Long no);

    @Select("""
            SELECT ROOM_TYPE_NO , ORIGIN_NAME, CHANGE_NAME, PATH, ORDER_NO
            FROM ATTACHMENT_TEMP_ROOM_TYPE
            WHERE ROOM_TYPE_NO = #{no}
            """)
    List<TempRoomtypeAttachmentVo> roomTypeAttachmentDetail(Long no);
}
