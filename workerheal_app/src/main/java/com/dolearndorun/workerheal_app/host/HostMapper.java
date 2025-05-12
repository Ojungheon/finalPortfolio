package com.dolearndorun.workerheal_app.host;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface    HostMapper {

    @Insert("INSERT INTO HOST(NO,ID,PW,NAME,PHONE)VALUES(SEQ_HOST.NEXTVAL,#{id},'12341234', #{name},#{phone})")
    void join(HostVo vo);

    // ✅ 호스트 정보 조회 (삭제되지 않은 계정만)
    @Select("SELECT NO, ID, PW, NAME, PHONE, IS_LOCK, ATTEMPT_NUM, ENROLL_DATE, DEL_YN FROM HOST WHERE ID = #{id} AND DEL_YN = 'N'")
    HostVo findHostById(String id);

    // ✅ 아이디 찾기 - 이름과 전화번호로 호스트 찾기
    @Select("SELECT ID FROM HOST WHERE NAME = #{name} AND PHONE = #{phone}")
    HostVo findHostByNameAndPhone(@Param("name") String name, @Param("phone") String phone);

    // ✅ 비밀번호 찾기 - 계정 정보 대조
    @Select("SELECT * FROM HOST WHERE ID = #{id} AND NAME = #{name} AND PHONE = #{phone} AND DEL_YN = 'N'")
    HostVo findHostByIdNamePhone(@Param("id") String id, @Param("name") String name, @Param("phone") String phone);

    // ✅ 비밀번호 변경
    @Update("UPDATE HOST SET PW = #{newPassword} WHERE ID = #{id}")
    void updatePassword(@Param("id") String id, @Param("newPassword") String newPassword);

    // 개인정보 조회
    @Select("SELECT ID , PW , PHONE FROM HOST WHERE NO= #{no}")
    List<HostVo> sellect(int no);

    HostVo getHostDetailsByNo(Long hostNo);
}
