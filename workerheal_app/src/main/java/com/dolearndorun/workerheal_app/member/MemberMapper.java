package com.dolearndorun.workerheal_app.member;

import org.apache.ibatis.annotations.*;

@Mapper
public interface MemberMapper {

    @Insert("INSERT INTO MEMBER (NO, ID, PW, NAME, NICK, PHONE, COMPANY, JOB_NO, POINT, ENROLL_DATE, IS_LOCK, ATTEMPT_NUM, DEL_YN) " +
            "VALUES (SEQ_MEMBER.NEXTVAL, #{id}, #{pw}, #{name}, #{nick}, #{phone}, #{company}, #{jobNo}, 0, SYSDATE, 'N', 0, 'N')")
    void join(MemberVo vo);

    // ✅ 회원 정보 업데이트 SQL 추가
    @Update("UPDATE MEMBER SET NAME = #{name}, NICK = #{nick}, PHONE = #{phone}, COMPANY = #{company}, JOB_NO = #{jobNo} WHERE ID = #{id}")
    void updateMember(MemberVo vo);

    @Select("SELECT NO, ID, PW, NAME, NICK, PHONE, JOB_NO, COMPANY, ENROLL_DATE, POINT FROM MEMBER WHERE ID = #{id} AND DEL_YN ='N' ")
    MemberVo findUserById(String id);

    //비밀번호 변경
    @Update("UPDATE MEMBER SET PW = #{newPassword} WHERE ID = #{id}")
    void changePassword(@Param("id") String id, @Param("newPassword") String newPassword);


    @Update("UPDATE MEMBER SET DEL_YN = 'Y' WHERE ID = #{id}")
    int updateDelYn(String id);

    @Select("SELECT ID FROM MEMBER WHERE NAME = #{name} AND PHONE = #{phone}")
    MemberVo findMemberByNameAndPhone(@Param("name") String name, @Param("phone") String phone);

    //비밀번호 찾기 - 계정 대조
    @Select("SELECT * FROM MEMBER WHERE ID = #{id} AND NAME = #{name} AND PHONE = #{phone} AND DEL_YN = 'N'")
    MemberVo findMemberByIdNamePhone(@Param("id") String id, @Param("name") String name, @Param("phone") String phone);

    //비밀번호 찾기 - 변경
    @Update("UPDATE MEMBER SET PW = #{newPassword} WHERE ID = #{id}")
    void updatePassword(@Param("id") String id, @Param("newPassword") String newPassword);

}
