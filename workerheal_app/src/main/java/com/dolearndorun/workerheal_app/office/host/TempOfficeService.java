package com.dolearndorun.workerheal_app.office.host;

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
@Transactional
@RequiredArgsConstructor
public class TempOfficeService {

    private final TempOfficeMapper tempOfficeMapper;

    private final AmazonS3 s3;
    // bucket 명 가져오기
    @Value("${aws.s3.bucket}")
    private String bucket;

    @Transactional
    public void officeEnroll(TempOfficeVo vo , MultipartFile repImage, List<MultipartFile> additionalFiles) throws IOException {

        // 임시 오피스 등록
        int result1 = tempOfficeMapper.officeEnroll(vo);

        // 이미지 파일 리스트에 저장
        List<TempOfficeAttachmentVo> imgVoList = new ArrayList<>();

        long officeNo = vo.getNo();

        // 대표 이미지 처리
        if (repImage != null && !repImage.isEmpty()){
            TempOfficeAttachmentVo repImgVo= new TempOfficeAttachmentVo();
            String[] fileInfo = FileUtil.uploadFileToAwsS3(repImage, s3 , bucket);
            repImgVo.setOfficeNo(officeNo);
            repImgVo.setOriginName(repImage.getOriginalFilename());
            repImgVo.setChangeName(fileInfo[0]);
            repImgVo.setPath(fileInfo[1]);
            repImgVo.setOrderNo(1);
            imgVoList.add(repImgVo);
        }

        // 추가 이미지 처리
        if (additionalFiles != null && !additionalFiles.isEmpty()) {
            int order = 2; // 대표 이미지가 있을 경우 추가 이미지는 2부터 시작
            for (MultipartFile file : additionalFiles) {
                if (file != null && !file.isEmpty()) {
                    TempOfficeAttachmentVo additionalImgVo = new TempOfficeAttachmentVo();
                    String[] fileInfo = FileUtil.uploadFileToAwsS3(file, s3, bucket);
                    additionalImgVo.setOfficeNo(officeNo);
                    additionalImgVo.setOriginName(file.getOriginalFilename());
                    additionalImgVo.setChangeName(fileInfo[0]);
                    additionalImgVo.setPath(fileInfo[1]);
                    additionalImgVo.setOrderNo(order++); // 필요한 경우 순서를 부여
                    imgVoList.add(additionalImgVo);
                }
            }
        }

        // 임시오피스 이미지 등록
        int result2 = tempOfficeMapper.insertTempOfficeAttachment(imgVoList , "");
        System.out.println("imgVoList = " + imgVoList);
    }

    public void updateOfficeByNo(TempOfficeVo vo) {
        int result = tempOfficeMapper.updateOfficeByNo(vo);
    }

    public int deleteOffice(int no) {
        int result = tempOfficeMapper.officeDelete(no);
        return result;
    }

    public TempOfficeVo officeDetail(int no) {
        return tempOfficeMapper.officeDetail(no);
    }

    public List<TempOfficeAttachmentVo> officeAttachmentDetail(int no) {
        List<TempOfficeAttachmentVo> voList = tempOfficeMapper.officeAttachmentDetail(no);
        return voList;
    }
}
