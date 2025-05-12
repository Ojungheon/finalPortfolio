package com.dolearndorun.workerheal_app.member.saved;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface SavedMapper {

    @Select("""
    SELECT
      L.NAME AS name, L.SCORE AS score, R.NAME AS region, L.TAG AS tag,
      A.PATH AS imagePath, '숙소' AS productType, L.NO AS no
    FROM SAVED_LODGING SL
    JOIN LODGING L ON SL.LODGING_NO = L.NO
    JOIN REGION R ON L.REGION_NO = R.NO
    LEFT JOIN ATTACHMENT_LODGING A ON A.LODGING_NO = L.NO AND A.ORDER_NO = 1 AND A.DEL_YN = 'N'
    WHERE SL.MEMBER_NO = #{memberNo} AND L.DEL_YN = 'N'
    
    UNION ALL
    
    SELECT
      O.NAME AS name, O.SCORE AS score, R.NAME AS region, O.TAG AS tag,
      A.PATH AS imagePath, '오피스' AS productType, O.NO AS no
    FROM SAVED_OFFICE SO
    JOIN OFFICE O ON SO.OFFICE_NO = O.NO
    JOIN REGION R ON O.REGION_NO = R.NO
    LEFT JOIN ATTACHMENT_OFFICE A ON A.OFFICE_NO = O.NO AND A.ORDER_NO = 1 AND A.DEL_YN = 'N'
    WHERE SO.MEMBER_NO = #{memberNo} AND O.DEL_YN = 'N'
    
    UNION ALL
    
    SELECT
      P.NAME, P.SCORE, R.NAME, P.TAG,
      A.PATH, '패키지' AS productType, P.NO
    FROM SAVED_PACKAGE SP
    JOIN PACKAGE P ON SP.PACKAGE_NO = P.NO
    JOIN REGION R ON P.REGION_NO = R.NO
    LEFT JOIN ATTACHMENT_PACKAGE A ON A.PACKAGE_NO = P.NO AND A.ORDER_NO = 1 AND A.DEL_YN = 'N'
    WHERE SP.MEMBER_NO = #{memberNo} AND P.DEL_YN = 'N'
    """)
    List<SavedVo> getSavedList(@Param("memberNo") Long memberNo);

    @Delete({
            "<script>",
            "<choose>",
            "   <when test=\"productType == '숙소'\">",
            "       DELETE FROM SAVED_LODGING",
            "       WHERE MEMBER_NO = #{memberNo}",
            "         AND LODGING_NO = (SELECT NO FROM LODGING WHERE NAME = #{name})",
            "   </when>",
            "   <when test=\"productType == '오피스'\">",
            "       DELETE FROM SAVED_OFFICE",
            "       WHERE MEMBER_NO = #{memberNo}",
            "         AND OFFICE_NO = (SELECT NO FROM OFFICE WHERE NAME = #{name})",
            "   </when>",
            "   <when test=\"productType == '패키지'\">",
            "       DELETE FROM SAVED_PACKAGE",
            "       WHERE MEMBER_NO = #{memberNo}",
            "         AND PACKAGE_NO = (SELECT NO FROM PACKAGE WHERE NAME = #{name})",
            "   </when>",
            "</choose>",
            "</script>"
    })
    int deleteSavedItem(
            @Param("memberNo") Long memberNo,
            @Param("name") String name,
            @Param("productType") String productType
    );



// OFFICE와 PACKAGE도 유사하게 추가

}
