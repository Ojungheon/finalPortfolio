package com.dolearndorun.workerheal_app.packages.manager;

import com.amazonaws.services.s3.AmazonS3;
import com.dolearndorun.workerheal_app.common.PageVo;
import com.dolearndorun.workerheal_app.lodging.LodgingAttachmentVo;
import com.dolearndorun.workerheal_app.lodging.LodgingVo;
import com.dolearndorun.workerheal_app.office.AttachmentOfficeVo;
import com.dolearndorun.workerheal_app.office.OfficeVo;
import com.dolearndorun.workerheal_app.packages.AttachmentPackagesVo;
import com.dolearndorun.workerheal_app.packages.PackagesVo;
import com.dolearndorun.workerheal_app.tour.TourAttachmentVo;
import com.dolearndorun.workerheal_app.tour.TourVo;
import com.dolearndorun.workerheal_app.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ManagerPackagesService {

    private final ManagerPackagesMapper managerPackagesMapper;
    private final AmazonS3 s3;
    // bucket 명 가져오기
    @Value("${aws.s3.bucket}")
    private String bucket;

    public PageVo<PackagesVo> listPackages(int page, int pageSize) {

        // Total number of packages (for pagination)
        long totalElements = managerPackagesMapper.countPackages();
        System.out.println("totalElements = " + totalElements);
        int offset = (page-1) * pageSize;
        // Get the paginated list of packages
        List<PackagesVo> packages = managerPackagesMapper.listPackages(offset, pageSize);

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        // Return PageVo with paginated data
        PageVo<PackagesVo> pageVo = new PageVo<>();
        pageVo.setContent(packages);
        pageVo.setTotalElements(totalElements);
        pageVo.setTotalPages(totalPages);
        pageVo.setCurrentPage(page);
        pageVo.setPageSize(pageSize);

        return pageVo;
    }

    public void deletePackages(List<String> noList) {
        managerPackagesMapper.updateDelYn(noList, "Y");
    }


    public PageVo<LodgingVo> listLodging(int page, int pageSize) {
        // Total number of lodgings (for pagination)
        long totalElements = managerPackagesMapper.countLodgings();
        int offset = (page-1) * pageSize;
        // Get the paginated list of lodgings
        List<LodgingVo> lodgings = managerPackagesMapper.listLodgings(offset, pageSize);

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        // Return PageVo with paginated data
        PageVo<LodgingVo> pageVo = new PageVo<>();
        pageVo.setContent(lodgings);
        pageVo.setTotalElements(totalElements);
        pageVo.setTotalPages(totalPages);
        pageVo.setCurrentPage(page);
        pageVo.setPageSize(pageSize);

        return pageVo;
    }

    public Map<String, Object> getLodgingByNo(int no) {
        List<LodgingVo> lodging =  managerPackagesMapper.getLodgingByNo(no);  // ✅ 리턴 타입을 List<LodgingVo>로 변경
        List<LodgingAttachmentVo> lodgingAttchment =  managerPackagesMapper.getLodgingAttchmentByNo(no);  // ✅ 리턴 타입을 List<LodgingVo>로 변경\

        Map<String, Object> resultSet = new HashMap<>();
        resultSet.put("lodging", lodging);
        resultSet.put("lodgingAttchment", lodgingAttchment);
        return resultSet;

    }

    public PageVo<OfficeVo> listOffice(int page, int pageSize) {
        // Total number of offices (for pagination)
        long totalElements = managerPackagesMapper.countOffices();
        int offset = (page-1) * pageSize;
        // Get the paginated list of offices
        List<OfficeVo> offices = managerPackagesMapper.listOffices(offset, pageSize);

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        // Return PageVo with paginated data
        PageVo<OfficeVo> pageVo = new PageVo<>();
        pageVo.setContent(offices);
        pageVo.setTotalElements(totalElements);
        pageVo.setTotalPages(totalPages);
        pageVo.setCurrentPage(page);
        pageVo.setPageSize(pageSize);

        return pageVo;
    }

    public Map<String, Object> getOfficeByNo(int no) {
        OfficeVo office = managerPackagesMapper.getOfficeByNo(no);
        List<AttachmentOfficeVo> officeAttchment =  managerPackagesMapper.getOfficeAttchmentByNo(no);

        Map<String, Object> resultSet = new HashMap<>();
        resultSet.put("office", office);
        resultSet.put("officeAttchment", officeAttchment);
        return resultSet;
    }

    public PageVo<TourVo> listProgram(int page, int pageSize) {
        // Total number of programs (for pagination)
        long totalElements = managerPackagesMapper.countPrograms();
        int offset = (page-1) * pageSize;
        // Get the paginated list of programs
        List<TourVo> programs = managerPackagesMapper.listPrograms(offset, pageSize);

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        // Return PageVo with paginated data
        PageVo<TourVo> pageVo = new PageVo<>();
        pageVo.setContent(programs);
        pageVo.setTotalElements(totalElements);
        pageVo.setTotalPages(totalPages);
        pageVo.setCurrentPage(page);
        pageVo.setPageSize(pageSize);

        return pageVo;
    }

    public Map<String, Object> getProgramByNo(int no) {
        TourVo program = managerPackagesMapper.getProgramByNo(no);
        List<TourAttachmentVo> programAttachment = managerPackagesMapper.getProgramAttchmentByNo(no);

        Map<String, Object> resultSet = new HashMap<>();
        resultSet.put("program", program);
        resultSet.put("programAttachment", programAttachment);
        return resultSet;
    }


    // 패키지정보 등록
    public void packageEnroll(MultipartFile file, PackagesVo vo) throws IOException {

        // 패키지정보 등록
        int result1 = managerPackagesMapper.insertPackage(vo);
        System.out.println("result1 = " + result1);

        // 이미지 파일 리스트에 저장
        AttachmentPackagesVo imgVo = new AttachmentPackagesVo();
        // aws 서버에 파일 업로드 및 파일 url 설정
        String[] fileInfo = FileUtil.uploadFileToAwsS3(file,s3,bucket);
        imgVo.setOriginName(file.getOriginalFilename()); // 원본 파일명 설정
        imgVo.setChangeName(fileInfo[0]);
        imgVo.setPath(fileInfo[1]);
        imgVo.setOrderNo(1);

        // 패키지정보 이미지 등록
        int result2 = managerPackagesMapper.insertPackageAttachment(imgVo);
        System.out.println("result2 = " + result2);

    }


    // 패키지 상세 정보 조회
    public PackagesVo getPackageDetail(Long packageNo) {
        PackagesVo packageInfo = managerPackagesMapper.getPackageDetail(packageNo);
        AttachmentPackagesVo packageImage = managerPackagesMapper.getPackageImage(packageNo);

        if (packageImage != null) {
            packageImage.setPath(packageImage.getPath());
        }

        return packageInfo;
    }

    // 패키지 수정
    public void updatePackage(PackagesVo vo, MultipartFile file) throws IOException {
        // 기존 이미지 정보 조회
        AttachmentPackagesVo existingImage = managerPackagesMapper.getPackageImage(Long.valueOf(vo.getNo()));

        // 새로운 이미지가 있으면 기존 이미지 삭제 후 업로드
        if (file != null && !file.isEmpty()) {
            if (existingImage != null) {
                s3.deleteObject(bucket, existingImage.getChangeName());
            }

            // 새 이미지 업로드
            String[] fileInfo = FileUtil.uploadFileToAwsS3(file, s3, bucket);
            AttachmentPackagesVo newImage = new AttachmentPackagesVo();
            newImage.setPackageNo(vo.getNo()+"");
            newImage.setOriginName(file.getOriginalFilename());
            newImage.setChangeName(fileInfo[0]);
            newImage.setPath(fileInfo[1]);
            newImage.setOrderNo(1);

            // 기존 이미지 삭제 후 새로운 이미지 등록
            managerPackagesMapper.deletePackageImage(Long.valueOf(vo.getNo()));
            managerPackagesMapper.insertPackageAttachmentEdit(newImage);
        }

        // 패키지 정보 업데이트
        managerPackagesMapper.updatePackage(vo);
    }
}
