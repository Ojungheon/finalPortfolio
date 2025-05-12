package com.dolearndorun.workerheal_app.roomtype.host;

import com.amazonaws.services.s3.AmazonS3;
import com.dolearndorun.workerheal_app.lodging.host.TempLodgingAttachmentVo;
import com.dolearndorun.workerheal_app.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TempRoomtypeService {

    private final TempRoomtypeMapper roomtypeMapper;

    private final AmazonS3 s3;
    // bucket 명 가져오기
    @Value("${aws.s3.bucket}")
    private String bucket;


    public List<TempRoomtypeVo> select(int lodgingNo) {
        return roomtypeMapper.sellect(lodgingNo);
    }

    public void roomTypeEnroll(TempRoomtypeVo vo , MultipartFile repImage, List<MultipartFile> additionalFiles) throws IOException {

        // 임시객실 정보 등록
        int result1 = roomtypeMapper.roomTypeEnroll(vo);

        // 이미지 파일 리스트에 저장
        List<TempRoomtypeAttachmentVo> imgVoList = new ArrayList<>();

        long roomTypeNo = vo.getNo();

        // 대표 이미지 처리
        // 대표 이미지 처리
        if (repImage != null && !repImage.isEmpty()){
            TempRoomtypeAttachmentVo repImgVo = new TempRoomtypeAttachmentVo();
            String[] fileInfo = FileUtil.uploadFileToAwsS3(repImage, s3 , bucket);
            repImgVo.setRoomTypeNo(roomTypeNo);
            repImgVo.setOriginName(repImage.getOriginalFilename());
            repImgVo.setChangeName(fileInfo[0]);
            repImgVo.setPath(fileInfo[1]);
            repImgVo.setOrderNo(1);
            imgVoList.add(repImgVo);
        }

        // 추가 이미지 처리: 추가 이미지에는 순차적으로 orderNo 부여 (필요에 따라 수정 가능)
        if (additionalFiles != null && !additionalFiles.isEmpty()) {
            int order = 2; // 대표 이미지가 있을 경우 추가 이미지는 2부터 시작
            for (MultipartFile file : additionalFiles) {
                if (file != null && !file.isEmpty()) {
                    TempRoomtypeAttachmentVo additionalImgVo = new TempRoomtypeAttachmentVo();
                    String[] fileInfo = FileUtil.uploadFileToAwsS3(file, s3, bucket);
                    additionalImgVo.setRoomTypeNo(roomTypeNo);
                    additionalImgVo.setOriginName(file.getOriginalFilename());
                    additionalImgVo.setChangeName(fileInfo[0]);
                    additionalImgVo.setPath(fileInfo[1]);
                    additionalImgVo.setOrderNo(order++); // 필요한 경우 순서를 부여
                    imgVoList.add(additionalImgVo);
                }
            }
        }

        // 임시객실 이미지 등록
        int result2 = roomtypeMapper.insertTempRoomtypeAttachment(imgVoList , "");
    }

    public TempRoomtypeVo roomTypeDetail(Long no) {
        return roomtypeMapper.roomTypeDetail(no);
    }

    public List<TempRoomtypeAttachmentVo> roomTypeAttachmentDetail(Long no) {
        List<TempRoomtypeAttachmentVo> voList = roomtypeMapper.roomTypeAttachmentDetail(no);
        return voList;
    }
}
