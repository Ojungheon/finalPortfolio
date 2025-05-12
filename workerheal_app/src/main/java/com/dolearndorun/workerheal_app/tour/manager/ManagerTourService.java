package com.dolearndorun.workerheal_app.tour.manager;

import com.amazonaws.services.s3.AmazonS3;
import com.dolearndorun.workerheal_app.tour.TourAttachmentVo;
import com.dolearndorun.workerheal_app.tour.TourVo;
import com.dolearndorun.workerheal_app.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ManagerTourService {

    private final ManagerTourMapper mapper;

    private final AmazonS3 s3;
    // bucket 명 가져오기
    @Value("${aws.s3.bucket}")
    private String bucket;

    // 관광정보 등록
    public void tourEnroll(List<MultipartFile> fileList, TourVo vo, List<Integer> orderNoList) throws IOException {

        // 관광정보 등록
        int result1 = mapper.insertTour(vo);
        System.out.println("result1 = " + result1);

        // formdata 로 넘기면서 순서 섞인 첨부파일 다시 입력 순서로 sorting
        List<MultipartFile> sortedFiles = new ArrayList<>(fileList);
        Collections.sort(sortedFiles, Comparator.comparingInt(file -> orderNoList.get(fileList.indexOf(file))));

        // 이미지 파일 리스트에 저장
        List<TourAttachmentVo> imgVoList = new ArrayList<>();
        for (MultipartFile file : sortedFiles) {
            TourAttachmentVo imgVo = new TourAttachmentVo();
            // aws 서버에 파일 업로드 및 파일 url 설정
            String[] fileInfo = FileUtil.uploadFileToAwsS3(file, s3, bucket);
            imgVo.setOriginName(file.getOriginalFilename()); // 원본 파일명 설정
            imgVo.setChangeName(fileInfo[0]);
            imgVo.setPath(fileInfo[1]);
            imgVo.setOrderNo(1);
            imgVoList.add(imgVo);
        }

        // 관광정보 이미지 등록
        int result2 = mapper.insertTourAttachment(imgVoList, "");
        System.out.println("result2 = " + result2);

        // 첨부파일 orderNo 재설정
        int result3 = mapper.updateOrderNo("");
        System.out.println("result3 = " + result3);

    }//tourEnroll

    // 관광정보 삭제
    public String deleteTourInfo(List<String> noList) {

        // 삭제하려는 항목의 예약내역 존재여부 확인
        List<String> reservationList =  mapper.checkTourReservation(noList);
        if(reservationList.size() >0){
            return String.join(", ",reservationList);
        }

        // 관광정보 삭제
        int result1 = mapper.deleteTourInfo(noList);
        System.out.println("result1 = " + result1);

        // 관광정보 첨부파일 삭제
        int result2 = mapper.deleteTourAttachment(noList, "delete");
        System.out.println("result2 = " + result2);

        return "success";

    }//deleteTourInfo

    // 관광정보 목록 조회 - 태훈
    public Map tourListByPageNo(int pno, int limit) {

        // 페이지 별 데이터 수 확인
        int offSet = (pno - 1) * limit;

        // 전체 페이지 수 수집
        long totalDataCnt = mapper.totalTourCnt();
        int totalPagesCnt = (int) Math.ceil((double) totalDataCnt / limit);

        // 리스트 정보 수집
        List<TourVo> voList = mapper.tourListByPageNo(offSet, limit);

        // 수집한 정보 map 저장
        Map map = new HashMap();
        map.put("totalPages", totalPagesCnt);
        map.put("tourVoList", voList);

        return map;

    }//tourListByPageNo

    // 관광정보 상세 조회 - 태훈
    public Map getTourByNo(String no) {

        // 관광정보 데이터 수집
        TourVo dbVo = mapper.getTourDetailByNo(no);

        // 관광정보 첨부파일 수집
        List<TourAttachmentVo> attachmentVoList = mapper.getTourAttachmentListByNo(no);

        // 수집한 정보 map 저장
        Map map = new HashMap();
        map.put("imgList", attachmentVoList);
        map.put("tourVo", dbVo);

        return map;

    }//getTourInfo

    // 관광정보 수정 - 태훈
    public void editTourByNo(TourVo vo, List<MultipartFile> fileList, List<String> deleteNoList, List<Integer> orderNoList) throws IOException {

        // 관광정보 첨부파일 삭제
        if (deleteNoList.size() > 0) {
            int result = mapper.deleteTourAttachment(deleteNoList, "edit");
            System.out.println("result = " + result);
        }

        // 관광정보 수정
        int result1 = mapper.updateTourInfo(vo);
        System.out.println("result1 = " + result1);

        // 관광정보 첨부파일 추가
        if (fileList != null && fileList.size() > 0) {

            // formdata 로 넘기면서 순서 섞인 첨부파일 다시 입력 순서로 sorting
            List<MultipartFile> sortedFiles = new ArrayList<>(fileList);
            Collections.sort(sortedFiles, Comparator.comparingInt(file -> orderNoList.get(fileList.indexOf(file))));

            // 이미지 파일 리스트에 저장
            List<TourAttachmentVo> imgVoList = new ArrayList<>();
            for (MultipartFile file : sortedFiles) {
                TourAttachmentVo imgVo = new TourAttachmentVo();
                // aws 서버에 파일 업로드 및 파일 url 설정
                String[] fileInfo = FileUtil.uploadFileToAwsS3(file, s3, bucket);
                imgVo.setOriginName(file.getOriginalFilename()); // 원본 파일명 설정
                imgVo.setChangeName(fileInfo[0]);
                imgVo.setPath(fileInfo[1]);
                imgVo.setOrderNo(1);
                imgVoList.add(imgVo);
            }

            // 관광정보 이미지 등록
            int result2 = mapper.insertTourAttachment(imgVoList, vo.getNo() + "");
            System.out.println("result2 = " + result2);

        }

        // 첨부파일 orderNo 재설정
        if (deleteNoList.size() > 0 || (fileList != null && fileList.size() > 0)) {
            int result3 = mapper.updateOrderNo(vo.getNo() + "");
            System.out.println("result3 = " + result3);
        }
    }
}