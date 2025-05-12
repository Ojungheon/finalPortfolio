package com.dolearndorun.workerheal_app.common.option;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface OptionMapper {

    // 지역 정보 조회 - 태훈
    @Select("""
            SELECT
            NO
            , NAME
            FROM REGION
            """)
    List<OptionVo> getRegionList();

    // 편의시설 정보 조회 - 태훈
    @Select("""
            SELECT
                CODE
                , NAME
            FROM FACILITE
            WHERE PRODUCT_NO LIKE (
                SELECT
                    '%' || no || '%' AS NO
                FROM PRODUCT_CODE
                WHERE NAME = #{productName}
            )
            """)
    List<FacilityVo> getFacilityList(String productName);

    // 관광정보 카테고리 조회 - 태훈
    @Select("""
            SELECT
            NO
            , NAME
            FROM TOUR_CATEGORY
            """)
    List<OptionVo> getTourCategoryList();
    
}//class
