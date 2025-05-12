package com.dolearndorun.workerheal_app.common.home;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PackageMapper {
    @Select("""
            SELECT P.NO, P.NAME, P.TAG, AP.PATH
            FROM PACKAGE P
            JOIN ATTACHMENT_PACKAGE AP ON AP.PACKAGE_NO = P.NO
            WHERE P.DEL_YN = 'N'
            AND ROWNUM <= 10
            ORDER BY DBMS_RANDOM.VALUE
            """)
    List<PackageVo> selectRandomPackages();
}
