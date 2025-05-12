package com.dolearndorun.workerheal_app.host;

import com.dolearndorun.workerheal_app.lodging.LodgingVo;
import com.dolearndorun.workerheal_app.office.OfficeVo;
import lombok.Data;

import java.util.List;

@Data
public class BusinessVo {
    private Long hostNo;
    private String hostId;
    private String hostName;
    private String hostEnrollDate;  // String으로 유지, DB에서 DATE 타입을 문자열로 가져오는 경우
    private String detailAddress;
    private String regionNo;
    private String regionName;
    private Long no;  // 사업장 번호 (no 컬럼 데이터)
    private String placeName;  // 사업장 명
    private String placeType;  // 사업장 유형
    private String placeTypeName;
    private String businessNo;
    private String enrollDate;
    private int amountOfStuff; // COUNT 값을 담을 int 타입 필드
}
