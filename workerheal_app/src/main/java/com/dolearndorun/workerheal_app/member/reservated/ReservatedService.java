package com.dolearndorun.workerheal_app.member.reservated;

import com.amazonaws.services.s3.AmazonS3;
import com.dolearndorun.workerheal_app.tour.TourAttachmentVo;
import com.dolearndorun.workerheal_app.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservatedService {

    private final AmazonS3 s3;
    // bucket 명 가져오기
    @Value("${aws.s3.bucket}")
    private String bucket;

    private final ReservatedMapper reservatedMapper;

    // ✅ 예약 내역 리스트 조회
    public List<ReservatedVo> getReservatedList(Long memberNo) {
        return reservatedMapper.getReservatedList(memberNo);
    }

    // ✅ 특정 오피스 예약 상세 조회
//    public OfficeReservatedVo getOfficeReservatedDetail(String reservationNo) {
    public Map<String ,Object> getOfficeReservatedDetail(String reservationNo) {
//        return reservatedMapper.getOfficeReservatedDetail(reservationNo); 태훈 수정
        OfficeReservatedVo reservateInfo = reservatedMapper.getOfficeReservatedDetail(reservationNo);
        List<ExtraFaciliteVo> extraFaciliteVoList = reservatedMapper.getOfficeExtraFaciliteList(reservationNo);

        Map<String , Object> map = new HashMap<>();
        map.put("officeInfo" , reservateInfo);
        map.put("extraInfo" , extraFaciliteVoList);
        return map;
    }

    // ✅ 숙소 예약 상세 조회
    public LodgingReservatedVo getLodgingReservatedDetail(String reservationNo) {
        return reservatedMapper.getLodgingReservatedDetail(reservationNo);
    }

    // ✅ 특정 예약 상세 조회 (숙소, 오피스, 패키지 통합)
//    public PackageReservatedVo getPackageReservatedDetail(String reservationNo) {
    public Map<String ,Object> getPackageReservatedDetail(String reservationNo) { // 태훈 수정
//        return reservatedMapper.getPackageReservatedDetail(reservationNo); 태훈 수정
        PackageReservatedVo reservateInfo = reservatedMapper.getPackageReservatedDetail(reservationNo);
        List<ExtraFaciliteVo> extraFaciliteVoList = reservatedMapper.getOfficeExtraFaciliteList(reservateInfo.getOfficeReservationNo());

        Map<String , Object> map = new HashMap<>();
        map.put("packageInfo" , reservateInfo);
        map.put("extraInfo" , extraFaciliteVoList);
        return map;

    }

    // ✅ 리뷰 작성 (상품 유형별로 다르게 처리)
    public void writeReview(ReviewVo reviewVo, MultipartFile file) throws IOException {
        if (reviewVo.getReservationNo() == null || reviewVo.getProductType() == null) {
            throw new RuntimeException("🚨 reservationNo 또는 productType 값이 없습니다.");
        }

        System.out.println("🔍 [DEBUG] reservationNo: " + reviewVo.getReservationNo());
        System.out.println("🔍 [DEBUG] productType: " + reviewVo.getProductType());

        int result = 0;
        Long reviewNo = null;

        //파일추가
        AttachmentReviewVo imgVo = new AttachmentReviewVo();
        // aws 서버에 파일 업로드 및 파일 url 설정
        String[] fileInfo = FileUtil.uploadFileToAwsS3(file,s3,bucket);
        imgVo.setOriginName(file.getOriginalFilename()); // 원본 파일명 설정
        imgVo.setChangeName(fileInfo[0]);
        imgVo.setPath(fileInfo[1]);
        imgVo.setOrderNo(1L);

        switch (reviewVo.getProductType()) {
            case "오피스":
                Long officeNo = reservatedMapper.findOfficeNoByReservationNo(reviewVo.getReservationNo().trim());
                if (officeNo == null) {
                    throw new RuntimeException("🚨 해당 reservationNo에 대한 OFFICE_NO가 존재하지 않습니다.");
                }
                result = reservatedMapper.insertOfficeReview(
                        reviewVo.getMemberNo(),
                        reviewVo.getReservationNo(),
                        officeNo,
                        reviewVo.getContent(),
                        reviewVo.getScore()
                );

                reviewNo = reservatedMapper.getOfficeReviewNo(reviewVo.getReservationNo().trim());

                if (reviewNo == null){
                    throw new RuntimeException("🚨 리뷰 등록 후 reviewNo 조회 실패");
                }
                imgVo.setReviewNo(reviewNo);

                reservatedMapper.insertOfficeImgFile(imgVo);
                break;

            case "숙소":
                Long lodgingNo = reservatedMapper.findLodgingNoByReservationNo(reviewVo.getReservationNo().trim());
                if (lodgingNo == null) {
                    throw new RuntimeException("🚨 해당 reservationNo에 대한 LODGING_NO가 존재하지 않습니다.");
                }
                result = reservatedMapper.insertLodgingReview(
                        reviewVo.getMemberNo(),
                        reviewVo.getReservationNo(),
                        lodgingNo,
                        reviewVo.getContent(),
                        reviewVo.getScore()
                );
                reviewNo = reservatedMapper.getLodgingReviewNo(reviewVo.getReservationNo().trim());

                if (reviewNo == null){
                    throw new RuntimeException("🚨 리뷰 등록 후 reviewNo 조회 실패");
                }
                imgVo.setReviewNo(reviewNo);
                System.out.println("imgVo = " + imgVo);

                reservatedMapper.insertLodgingImgFile(imgVo);
                break;

            case "패키지":
                Long packageNo = reservatedMapper.findPackageNoByReservationNo(reviewVo.getReservationNo().trim());
                if (packageNo == null) {
                    throw new RuntimeException("🚨 해당 reservationNo에 대한 PACKAGE_NO가 존재하지 않습니다.");
                }
                result = reservatedMapper.insertPackageReview(
                        reviewVo.getMemberNo(),
                        reviewVo.getReservationNo(),
                        packageNo,
                        reviewVo.getContent(),
                        reviewVo.getScore()
                );
                reviewNo = reservatedMapper.getPackageReviewNo(reviewVo.getReservationNo().trim());

                if (reviewNo == null){
                    throw new RuntimeException("🚨 리뷰 등록 후 reviewNo 조회 실패");
                }
                imgVo.setReviewNo(reviewNo);

                reservatedMapper.insertPackageImgFile(imgVo);
                break;

            default:
                throw new IllegalArgumentException("🚨 잘못된 productType 값: " + reviewVo.getProductType());
        }

        System.out.println("✅ [DEBUG] INSERT 실행 결과 (1이면 성공): " + result);
        if (result == 0) {
            throw new RuntimeException("🚨 리뷰 등록 실패");
        }



    }

    //리뷰여부
    public boolean isReviewWritten(String reservationNo, String productType) {
        if ("오피스".equals(productType)) {
            return reservatedMapper.checkOfficeReviewExists(reservationNo) > 0;
        } else if ("숙소".equals(productType)) {
            return reservatedMapper.checkLodgingReviewExists(reservationNo) > 0;
        } else if ("패키지".equals(productType)) {
            return reservatedMapper.checkPackageReviewExists(reservationNo) > 0;
        }
        return false;
    }
    // 리뷰 확인 서비스
    public ReviewVo getReviewByReservationNo(String reservationNo, String productType) {
        ReviewVo review;

        switch (productType) {
            case "오피스":
                review = reservatedMapper.findOReviewByReservationNo(reservationNo);
                break;
            case "숙소":
                review = reservatedMapper.findLReviewByReservationNo(reservationNo);
                break;
            case "패키지":
                review = reservatedMapper.findPReviewByReservationNo(reservationNo);
                break;
            default:
                throw new IllegalArgumentException("🚨 잘못된 productType 값: " + productType);
        }

        // 🔍 [DEBUG] 조회된 리뷰 데이터 로그 출력
        if (review != null) {
            System.out.println("🔍 [DEBUG] 조회된 리뷰 데이터:");
            System.out.println("예약번호: " + review.getReservationNo());
            System.out.println("별점: " + review.getScore());
            System.out.println("내용: " + review.getContent());
            System.out.println("이미지 경로: " + review.getPath());
        } else {
            System.out.println("🚨 리뷰 데이터 없음!");
        }

        return review;
    }





}
