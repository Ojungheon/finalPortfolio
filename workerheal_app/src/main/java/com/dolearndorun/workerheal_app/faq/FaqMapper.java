package com.dolearndorun.workerheal_app.faq;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FaqMapper {

    @Select("""
            SELECT
                NO
                ,NAME
            FROM FAQ_CATEGORY
            """)
    List<FaqCategoryVo> cateList();

    @Select("""
            SELECT
                 f.NO,
                 f.FAQ_CATEGORY_NO,
                 f.QUESTION,
                 f.DETAIL,
                 f.ENROLL_DATE,
                 f.DEL_YN,
                 c.NAME AS CATEGORY_NAME
             FROM FAQ f
             JOIN FAQ_CATEGORY c
             ON c.NO = f.FAQ_CATEGORY_NO
             WHERE f.FAQ_CATEGORY_NO = #{categoryNo}
             AND f.DEL_YN = 'N'
         """)
    List<FaqVo> list(@Param("categoryNo") int no);


}
