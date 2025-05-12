package com.dolearndorun.workerheal_app.approval;

import lombok.Data;

@Data
public class ApprovalVo {

    private Long hostNo; // 호스트 번호
    private String hostName; // 호스트 이름
    private String regionNo; // 지역 번호
    private String regionName; // 지역 명
    private Long no; // 사업장 번호 (no 컬럼 데이터)
    private String placeName; // 사업장 명 (name 컬럼 데이터)
    private String placeType; // 사업장 유형
    private String placeTypeName; // 사업장 유형 명
    private String statusNo; // 상태 번호
    private String statusName; // 상태
    private String businessNo; // 등록 된 사업자 번호
    private String createDate; // 요청 일자

}
