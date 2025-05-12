package com.dolearndorun.workerheal_app.manager;

import com.dolearndorun.workerheal_app.host.BusinessVo;
import com.dolearndorun.workerheal_app.host.HostVo;
import com.dolearndorun.workerheal_app.lodging.LodgingVo;
import com.dolearndorun.workerheal_app.member.MemberVo;
import com.dolearndorun.workerheal_app.member.reservated.LodgingReservatedVo;
import com.dolearndorun.workerheal_app.member.reservated.OfficeReservatedVo;
import com.dolearndorun.workerheal_app.member.reservated.ReservatedVo;
import com.dolearndorun.workerheal_app.office.OfficeVo;
import com.dolearndorun.workerheal_app.packages.PackagesVo;
import com.dolearndorun.workerheal_app.packages.ReservationPackageVo;
import com.dolearndorun.workerheal_app.packages.ReservationTourVo;
import com.dolearndorun.workerheal_app.tour.TourVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ManagerMapper {


    @Insert("INSERT INTO MANAGER(NO,ID,PW,NAME,PHONE)VALUES(SEQ_MANAGER.NEXTVAL,#{id},#{pw},#{name},#{phone})")
    void join(ManagerVo vo);

    @Select("SELECT NO, ID, PW, NAME, PHONE, IS_LOCK,ATTEMPT_NUM, ENROLL_DATE, DEL_YN FROM MANAGER WHERE ID = #{id} AND DEL_YN = 'N'")
    ManagerVo findManagerById(String id);

    //아이디찾기
    @Select("SELECT ID FROM MANAGER WHERE NAME = #{name} AND PHONE = #{phone}")
    ManagerVo findHostByNameAndPhone(String name, String phone);

    // ✅ 비밀번호 찾기 - 계정 정보 대조
    @Select("SELECT * FROM MANAGER WHERE ID = #{id} AND NAME = #{name} AND PHONE = #{phone} AND DEL_YN = 'N'")
    ManagerVo findHostByIdNamePhone(@Param("id") String id, @Param("name") String name, @Param("phone") String phone);

    // ✅ 비밀번호 변경
    @Update("UPDATE MANAGER SET PW = #{newPassword} WHERE ID = #{id}")
    void updatePassword(@Param("id") String id, @Param("newPassword") String newPassword);


    //호스트 갯수 측정
    @Select("SELECT COUNT(*) FROM HOST WHERE DEL_YN = 'N'")
    long countHosts();

    //호스트 정보 가져오기
    @Select("""
SELECT
    NO,
    ID,
    NAME,
    TO_CHAR(ENROLL_DATE, 'YYYY-MM-DD') AS ENROLL_DATE,
    DEL_YN,
    (SELECT COUNT(*) FROM LODGING WHERE HOST_NO = HOST.NO) + (SELECT COUNT(*) FROM OFFICE WHERE HOST_NO = HOST.NO) AS businessCount
FROM HOST
WHERE DEL_YN = 'N'
ORDER BY NO DESC
OFFSET #{offset} ROWS FETCH NEXT #{pageSize} ROWS ONLY
    """)
    List<HostVo> listHosts(int offset, int pageSize);
//    host.businessCount 넣어야함



    @Select("""
    SELECT COUNT(*) 
    FROM (
        SELECT h.NO 
        FROM HOST h
        LEFT JOIN LODGING l ON h.NO = l.HOST_NO
        WHERE h.NO = #{no} AND l.NO IS NOT NULL
        
        UNION ALL
        
        SELECT h.NO 
        FROM HOST h
        LEFT JOIN OFFICE o ON h.NO = o.HOST_NO
        WHERE h.NO = #{no} AND o.NO IS NOT NULL
    )
""")
    long countHostDetails(Long no);

@Select("""
        SELECT *
        FROM HOST
        WHERE NO = #{no}
        """)
    HostVo getHostDetails(Long no);

    @Select("""
    SELECT * FROM (
        SELECT 
            h.NO AS hostNo,
            h.ID AS hostId,
            h.NAME AS hostName,
            h.ENROLL_DATE AS hostEnrollDate,
            l.NAME AS placeName,  
            l.BUSINESS_NO AS businessNo,
            r.NAME AS regionName, 
            '숙소' AS placeType,
            (SELECT COUNT(*) FROM LODGING WHERE host_no = #{no}) AS amountOfStuff
        FROM HOST h
        LEFT JOIN LODGING l ON h.NO = l.HOST_NO
        LEFT JOIN REGION r ON l.REGION_NO = r.NO
        WHERE h.NO = #{no} AND l.NAME IS NOT NULL  -- ❗ 숙소 데이터가 없으면 제외
    
        UNION ALL
    
        SELECT 
            h.NO AS hostNo,
            h.ID AS hostId,
            h.NAME AS hostName,
            h.ENROLL_DATE AS hostEnrollDate,
            o.NAME AS placeName,
            o.BUSINESS_NO AS businessNo,
            r.NAME AS regionName,  
            '오피스' AS placeType,
            (SELECT COUNT(*) FROM OFFICE WHERE host_no = #{no}) AS amountOfStuff
        FROM HOST h
        LEFT JOIN OFFICE o ON h.NO = o.HOST_NO
        LEFT JOIN REGION r ON o.REGION_NO = r.NO
        WHERE h.NO = #{no} AND o.NAME IS NOT NULL  -- ❗ 오피스 데이터가 없으면 제외
    ) 
    ORDER BY hostNo
    OFFSET #{offset} ROWS FETCH NEXT #{pageSize} ROWS ONLY
""")
    List<BusinessVo> getHostDetailsWithLodgingAndOffice(Long no, int offset, int pageSize);


    @Insert("""
                INSERT INTO HOST
                (
                    NO,
                    ID,
                    PW,
                    NAME,
                    PHONE
                )
                VALUES
                (
                    SEQ_HOST.NEXTVAL,
                    #{id},
                    '12341234',
                    #{name},
                    #{phone}
                )
            """)
    void insertHost(HostVo vo);

    @Select("SELECT COUNT(*) FROM MEMBER")
    long countMember();

    @Select("""
            SELECT
                *
            FROM MEMBER
            ORDER BY NO DESC
            OFFSET #{offset} ROWS FETCH NEXT #{pageSize} ROWS ONLY
            """)
    List<MemberVo> getMemberList(int offset, int pageSize);



    // 숙소 예약 상세 조회
    @Select("""
                SELECT r.reservation_no, r.name, r.status, l.region, r.reservate_num, r.price, l.image_path, r.start_date, r.end_date, 'LO' AS product_type, m.member_name 
                FROM reservation_lodging r 
                JOIN lodging l ON r.lodging_no = l.lodging_no 
                JOIN member m ON r.member_no = m.member_no 
                WHERE r.reservation_no = #{searchKeyword}
            """)
    ReservatedVo getLodgingReservationDetailByNo(String searchKeyword);

    // 오피스 예약 상세 조회
    @Select("""
                SELECT r.reservation_no, r.name, r.status, o.region, r.reservate_num, r.price, o.image_path, r.start_date, r.end_date, 'OF' AS product_type, m.member_name 
                FROM reservation_office r 
                JOIN office o ON r.office_no = o.office_no 
                JOIN member m ON r.member_no = m.member_no 
                WHERE r.reservation_no = #{searchKeyword}
            """)
    ReservatedVo getOfficeReservationDetailByNo(String searchKeyword);

    // 패키지 예약 상세 조회
    @Select("""
                SELECT r.reservation_no, r.name, r.status, p.region, r.reservate_num, r.price, p.image_path, r.start_date, r.end_date, 'PA' AS product_type, m.member_name 
                FROM reservation_package r 
                JOIN package p ON r.package_no = p.package_no 
                JOIN member m ON r.member_no = m.member_no 
                WHERE r.reservation_no = #{searchKeyword}
            """)
    ReservatedVo getPackageReservationDetailByNo(String searchKeyword);


}
