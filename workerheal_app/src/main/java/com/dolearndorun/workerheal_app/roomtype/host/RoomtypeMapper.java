package com.dolearndorun.workerheal_app.roomtype.host;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RoomtypeMapper {

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
            FROM ROOM_TYPE
            WHERE LODGING_NO = #{lodgingNo}
            """)
    List<RoomtypeVo> sellect(Long lodgingNo);
}
