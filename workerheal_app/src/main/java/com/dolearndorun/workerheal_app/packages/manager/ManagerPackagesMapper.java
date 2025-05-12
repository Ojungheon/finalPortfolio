package com.dolearndorun.workerheal_app.packages.manager;

import com.dolearndorun.workerheal_app.lodging.LodgingAttachmentVo;
import com.dolearndorun.workerheal_app.lodging.LodgingVo;
import com.dolearndorun.workerheal_app.office.AttachmentOfficeVo;
import com.dolearndorun.workerheal_app.office.OfficeVo;
import com.dolearndorun.workerheal_app.packages.AttachmentPackagesVo;
import com.dolearndorun.workerheal_app.packages.PackagesVo;
import com.dolearndorun.workerheal_app.tour.TourAttachmentVo;
import com.dolearndorun.workerheal_app.tour.TourVo;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Mapper
public interface ManagerPackagesMapper {

    @Select("SELECT COUNT(*) FROM PACKAGE WHERE DEL_YN = 'N'")
    long countPackages();

    @Select("""
            SELECT
                p.NO,
                p.NAME,
                p.REGION_NO,
                r.NAME AS REGION_NAME, -- ✅ SQL에서 컬럼명 지정
                TO_CHAR(p.ENROLL_DATE, 'YYYY-MM-DD') AS ENROLL_DATE,
                p.FINISH_YN
            FROM PACKAGE p
            LEFT JOIN REGION r ON p.REGION_NO = r.NO -- ✅ JOIN 사용
            WHERE p.DEL_YN = 'N'
            ORDER BY p.NO DESC
            OFFSET #{offset} ROWS FETCH NEXT #{pageSize} ROWS ONLY
            """)
    List<PackagesVo> listPackages(int offset, int pageSize);


    @UpdateProvider(type = SqlBuilder.class, method = "buildDeleteQuery")
    void updateDelYn(@Param("noList") List<String> noList, @Param("delYn") String delYn);


    class SqlBuilder {
        public static String buildDeleteQuery(Map<String, Object> params) {
            @SuppressWarnings("unchecked")
            List<String> noList = (List<String>) params.get("noList");

            StringBuilder sql = new StringBuilder();
            sql.append("UPDATE PACKAGE SET DEL_YN = #{delYn} WHERE NO IN (");
            sql.append(noList.stream().map(no -> "#{noList[" + noList.indexOf(no) + "]}").collect(Collectors.joining(",")));
            sql.append(")");

            return sql.toString();
        }
    }

    @Select("SELECT COUNT(*) FROM LODGING WHERE DEL_YN = 'N'")
    long countLodgings();

    @Select("""
            SELECT
                L.NO AS no,
                L.HOST_NO AS hostNo,
                L.NAME AS name,
                L.REGION_NO AS regionNo,
                R.NAME AS regionName, -- ✅ REGION 테이블에서 지역명 가져오기
                TO_CHAR(L.ENROLL_DATE, 'YYYY-MM-DD') AS enrollDate,
                H.NAME AS hostName
            FROM LODGING L
            LEFT JOIN HOST H ON L.HOST_NO = H.NO
            LEFT JOIN REGION R ON L.REGION_NO = R.NO -- ✅ REGION JOIN 추가
            WHERE L.DEL_YN = 'N'
            ORDER BY L.NO DESC
            OFFSET #{offset} ROWS FETCH NEXT #{pageSize} ROWS ONLY
            """)
    List<LodgingVo> listLodgings(int offset, int pageSize);

    @Select("SELECT COUNT(*) FROM OFFICE WHERE DEL_YN = 'N'")
    long countOffices();

    @Select("""
                SELECT
                    l.*
                    , r.NAME AS roomName
                    , r.PRICE AS roomPrice
                    , r.AMOUNT AS roomAmount
                    , r.CHECK_IN AS checkIn
                    , r.CHECK_Out AS checkOut
                FROM LODGING l
                LEFT JOIN ROOM_TYPE r ON l.NO = r.LODGING_NO
                WHERE l.NO = #{no}
            """)
    List<LodgingVo> getLodgingByNo(int no);

    @Select("""
            SELECT
                NO
                ,LODGING_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,PATH
                ,ORDER_NO
                ,UPLOAD_DATE
                ,DEL_YN
            FROM
                ATTACHMENT_LODGING
            WHERE
                LODGING_NO = #{lodgingNo}
                AND DEL_YN = 'N'
            """)
    List<LodgingAttachmentVo> getLodgingAttchmentByNo(int no);



    @Select("""
            SELECT
                O.NO AS no,
                O.HOST_NO AS hostNo,
                O.NAME AS name,
                O.REGION_NO AS regionNo,
                R.NAME AS regionName,  -- 지역 이름을 가져옵니다.
                TO_CHAR(O.ENROLL_DATE, 'YYYY-MM-DD') AS enrollDate,
                H.NAME AS hostName
            FROM OFFICE O
            LEFT JOIN HOST H ON O.HOST_NO = H.NO
            LEFT JOIN REGION R ON O.REGION_NO = R.NO  -- REGION 테이블과 조인하여 지역 이름을 가져옵니다.
            WHERE O.DEL_YN = 'N'
            ORDER BY O.NO DESC
            OFFSET #{offset} ROWS FETCH NEXT #{pageSize} ROWS ONLY
            """)
    List<OfficeVo> listOffices(int offset, int pageSize);

    @Select("SELECT COUNT(*) FROM TOUR_SPOT WHERE DEL_YN = 'N'")
    long countPrograms();

    @Select("""
            SELECT
                O.*,
                (SELECT LISTAGG(F.NAME, ', ') WITHIN GROUP (ORDER BY F.NAME)
                 FROM FACILITE F
                 WHERE F.CODE IN (
                     SELECT REGEXP_SUBSTR(O.FACILITIE_CODE, '[^,]+', 1, LEVEL)
                     FROM DUAL
                     CONNECT BY REGEXP_SUBSTR(O.FACILITIE_CODE, '[^,]+', 1, LEVEL) IS NOT NULL
                 )
                ) AS facilitieName
            FROM OFFICE O
            WHERE O.NO = #{no}
            """)
    OfficeVo getOfficeByNo(int no);


    @Select("""
            SELECT
                NO
                ,OFFICE_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,PATH
                ,ORDER_NO
                ,UPLOAD_DATE
                ,DEL_YN
            FROM
                ATTACHMENT_OFFICE
            WHERE
                OFFICE_NO = #{officeNo}
                AND DEL_YN = 'N'
            """)
    List<AttachmentOfficeVo> getOfficeAttchmentByNo(int no);


    @Select("""
            SELECT
                T.NO AS no,
                T.NAME AS name,
                T.REGION_NO AS regionNo,
                R.NAME AS regionName, -- ✅ REGION 테이블에서 지역명 가져오기
                TO_CHAR(T.ENROLL_DATE, 'YYYY-MM-DD') AS enrollDate,
                T.PRICE AS price
            FROM TOUR_SPOT T
            LEFT JOIN REGION R ON T.REGION_NO = R.NO -- ✅ REGION JOIN 추가
            WHERE T.DEL_YN = 'N'
            ORDER BY T.NO DESC
            OFFSET #{offset} ROWS FETCH NEXT #{pageSize} ROWS ONLY
            """)
    List<TourVo> listPrograms(int offset, int pageSize);

    @Select("""
            SELECT *
            FROM TOUR_SPOT
            WHERE NO = #{no}
            """)
    TourVo getProgramByNo(int no);

    @Select("""
            SELECT
                NO
                ,TOUR_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,PATH
                ,ORDER_NO
                ,UPLOAD_DATE
                ,DEL_YN
            FROM
                ATTACHMENT_TOUR_SPOT
            WHERE
                TOUR_NO = #{tourNo}
                AND DEL_YN = 'N'
            """)
    List<TourAttachmentVo> getProgramAttchmentByNo(int no);

    // 패키지 등록
    @Insert("""
            INSERT INTO PACKAGE
            (
                NO,
                MANAGER_NO,
                OFFICE_NO,
                LODGING_NO,
                TOUR_SPOT_NO,
                REGION_NO,
                NAME,
                DETAIL,
                DISCOUNT,
                IS_TEMPORARY,
                OPEN_DATE,
                CLOSE_DATE,
                FINISH_YN,
                TAG,
                SCORE,
                ENROLL_DATE,
                MODIFY_DATE,
                DEL_YN
            )
            VALUES
            (
                SEQ_PACKAGE.NEXTVAL,
                #{managerNo},
                #{officeNo},
                #{lodgingNo},
                #{tourSpotNo},
                #{regionNo},
                #{name},
                #{detail},
                #{discount},
                #{isTemporary},
                #{openDate},
                #{closeDate},
                'N',
                #{tag},
                '0',
                SYSDATE,
                SYSDATE,
                'N'
            )
        """)
    int insertPackage(PackagesVo vo);

    @Insert("""
        INSERT INTO ATTACHMENT_PACKAGE
            (
            NO,
            PACKAGE_NO,
            ORIGIN_NAME,
            CHANGE_NAME,
            PATH,
            ORDER_NO,
            UPLOAD_DATE
            )
        VALUES
            (
            SEQ_ATTACHMENT_PACKAGE.NEXTVAL,
            SEQ_PACKAGE.CURRVAL,
            #{originName},
            #{changeName},
            #{path},
            #{orderNo},
            SYSDATE
            )
    """)
    int insertPackageAttachment(AttachmentPackagesVo imgVo);


    // 패키지 상세 조회
    @Select("""
        SELECT * FROM PACKAGE WHERE NO = #{packageNo} AND DEL_YN = 'N'
    """)
    PackagesVo getPackageDetail(Long packageNo);

    // 패키지 이미지 조회
    @Select("""
        SELECT * FROM ATTACHMENT_PACKAGE WHERE PACKAGE_NO = #{packageNo}
    """)
    AttachmentPackagesVo getPackageImage(Long packageNo);

    // 패키지 업데이트
    @Update("""
        UPDATE PACKAGE SET
            OFFICE_NO = #{officeNo},
            LODGING_NO = #{lodgingNo},
            TOUR_SPOT_NO = #{tourSpotNo},
            REGION_NO = #{regionNo},
            NAME = #{name},
            DETAIL = #{detail},
            DISCOUNT = #{discount},
            IS_TEMPORARY = COALESCE(#{isTemporary}, 'N'),
            OPEN_DATE = #{openDate},
            CLOSE_DATE = #{closeDate},
            TAG = #{tag},
            MODIFY_DATE = SYSDATE
        WHERE NO = #{no}
    """)
    int updatePackage(PackagesVo vo);

    // 기존 이미지 삭제
    @Delete("""
        DELETE FROM ATTACHMENT_PACKAGE WHERE PACKAGE_NO = #{packageNo}
    """)
    int deletePackageImage(Long packageNo);

    // 새로운 이미지 등록
    @Insert("""
        INSERT INTO ATTACHMENT_PACKAGE
        (
            NO
            , PACKAGE_NO
            , ORIGIN_NAME
            , CHANGE_NAME
            , PATH
            , ORDER_NO
            , UPLOAD_DATE
        )
        VALUES
        (
            SEQ_ATTACHMENT_PACKAGE.NEXTVAL,
            #{packageNo},
            #{originName},
            #{changeName},
            #{path},
            #{orderNo},
            SYSDATE
        )
    """)
    int insertPackageAttachmentEdit(AttachmentPackagesVo imgVo);


}
