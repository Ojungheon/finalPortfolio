package com.dolearndorun.workerheal_app.lodging.host;

import com.amazonaws.services.s3.AmazonS3;
import com.dolearndorun.workerheal_app.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TempLodgingService {

    private final TempLodgingMapper lodgingMapper;

    private final AmazonS3 s3;
    // bucket 명 가져오기
    @Value("${aws.s3.bucket}")
    private String bucket;

    public List<TempLodgingVo> findAll(int pno) {
        int limit = 10;
        int offset = (pno-1) * limit;
        return  lodgingMapper.findAll(offset, limit);
    }

    // 임시숙소 등록
    @Transactional
    public void lodgingEnroll(TempLodgingVo vo, MultipartFile repImage, List<MultipartFile> additionalFiles) throws IOException {

        // 임시숙소 정보 등록
        int result1 = lodgingMapper.lodgingEnroll(vo);
        System.out.println("result1 = " + result1);

        //이미지 파일 리스트에 저장
        List<TempLodgingAttachmentVo> imgVoList = new ArrayList<>();

        long lodgingNo = vo.getNo();
        System.out.println("lodgingNo = " + lodgingNo);

        // 대표 이미지 처리
        if (repImage != null && !repImage.isEmpty()){
            TempLodgingAttachmentVo repImgVo = new TempLodgingAttachmentVo();
            String[] fileInfo = FileUtil.uploadFileToAwsS3(repImage, s3 , bucket);
            repImgVo.setLodgingNo(lodgingNo);
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
                    TempLodgingAttachmentVo additionalImgVo = new TempLodgingAttachmentVo();
                    String[] fileInfo = FileUtil.uploadFileToAwsS3(file, s3, bucket);
                    additionalImgVo.setLodgingNo(lodgingNo);
                    additionalImgVo.setOriginName(file.getOriginalFilename());
                    additionalImgVo.setChangeName(fileInfo[0]);
                    additionalImgVo.setPath(fileInfo[1]);
                    additionalImgVo.setOrderNo(order++); // 필요한 경우 순서를 부여
                    imgVoList.add(additionalImgVo);
                }
            }
        }

        // 임시숙소 이미지 등록
        int result2 = lodgingMapper.insertTempLodgingAttachment(imgVoList ,"");
        System.out.println("result2 = " + result2);

    }

    public TempLodgingVo lodgingDetail(int no) {
        return lodgingMapper.lodgingDetail(no);
    }

    public void updateLodgingByNo(TempLodgingVo vo) {
        int result1 = lodgingMapper.updateLodgingByNo(vo);
    }

    public int lodgingDelete(int no) {
        int result = lodgingMapper.lodgingDelete(no);
        return result;
    }


    public List<TempLodgingAttachmentVo> lodgingAttachmentDetail(int no) {
        List<TempLodgingAttachmentVo> voList = lodgingMapper.lodgingAttachmentDetail(no);
        return voList;
    }
}
