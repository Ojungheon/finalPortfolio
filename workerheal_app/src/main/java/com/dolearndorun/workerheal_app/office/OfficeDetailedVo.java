package com.dolearndorun.workerheal_app.office;

import lombok.Data;

@Data
public class OfficeDetailedVo {
    private int no;
    private String officeName;
    private String officeAddress;
    private String officeDetailAddress;
    private String officePhone;
    private String officeTag;
    private int price;
    private String officeDetail;
    private String officeCapacity;
    private String officeOpenTime;
    private String officeCloseTime;
    private String officeFacilities;
    private String officeExtraCode;
    private String officeScore;
    private String attachmentOriginalName;
    private String attachmentSavedName;
    private String attachmentPath;
    private String reviewNo;
    private int memberNo;
    private String memberName;
    private String reviewContent;
    private String reviewScore;
    private String reviewEnrollDate;
    private String reviewAttachmentNo;
    private String reviewAttachmentOriginalName;
    private String reviewAttachmentSavedName;
    private String reviewAttachmentPath;
}
