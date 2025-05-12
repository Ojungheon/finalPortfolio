package com.dolearndorun.workerheal_app.packages.manager;

import com.dolearndorun.workerheal_app.common.PageVo;
import com.dolearndorun.workerheal_app.lodging.LodgingVo;
import com.dolearndorun.workerheal_app.office.OfficeVo;
import com.dolearndorun.workerheal_app.packages.PackagesVo;
import com.dolearndorun.workerheal_app.security.SecurityUserDetails;
import com.dolearndorun.workerheal_app.tour.TourVo;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RequestMapping("api/manager/packages")
@RestController
@Slf4j
public class ManagerPackagesController {

    private final ManagerPackagesService managerPackagesService;

    @GetMapping("/list")
    public PageVo<PackagesVo> listPackages(@RequestParam int page, @RequestParam int pageSize) {
        return managerPackagesService.listPackages(page, pageSize);
    }

    @PostMapping("/delete")
    public void deletePackage(@RequestBody List<String> noList) {  // 여기 List<String>으로 변경
        System.out.println("noList = " + noList);
        managerPackagesService.deletePackages(noList);  // String 타입으로 처리
    }

    @GetMapping("/list/lodging")
    public PageVo<LodgingVo> listLodging(@RequestParam int page, @RequestParam int pageSize) {
        return managerPackagesService.listLodging(page, pageSize);
    }

    @GetMapping("/lodgingDetail/{no}")
    public ResponseEntity<Map<String, Object>> getLodgingByNo(@PathVariable int no) {
        Map<String, Object> result = managerPackagesService.getLodgingByNo(no);

        if (result != null) {  // ✅ `result`가 null이 아닐 때 응답
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @GetMapping("/list/office")
    public PageVo<OfficeVo> listOffice(@RequestParam int page, @RequestParam int pageSize) {
        return managerPackagesService.listOffice(page, pageSize);
    }

    @GetMapping("/officeDetail/{no}")
    public ResponseEntity<Map<String, Object>> getOfficeByNo(@PathVariable int no) {
        Map<String, Object> result = managerPackagesService.getOfficeByNo(no);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/list/program")
    public PageVo<TourVo> listProgram(@RequestParam int page, @RequestParam int pageSize) {
        return managerPackagesService.listProgram(page, pageSize);
    }

    @GetMapping("/programDetail/{no}")
    public ResponseEntity<Map<String, Object>> getProgramByNo(@PathVariable int no) {
        Map<String, Object> result = managerPackagesService.getProgramByNo(no);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("enroll")
    public void packageEnroll(PackagesVo vo, @RequestParam("image") MultipartFile file) {
        System.out.println("vo = " + vo);

        // SecurityUserDetails 에서 작성자 정보 수집
        SecurityUserDetails khUserDetails = (SecurityUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long writerNo = khUserDetails.getNo();
        vo.setManagerNo(writerNo);

//        vo.setManagerNo("1"); // 관리번호 강제 세팅

        try {
            managerPackagesService.packageEnroll(file, vo);
        } catch (Exception e) {
            System.out.println("e = " + e);
            throw new IllegalStateException("패키지 등록 오류");
        }

    }

    // 패키지 상세 조회
    @GetMapping("/detail/{packageNo}")
    public PackagesVo getPackageDetail(@PathVariable("packageNo") Long packageNo) {
        return managerPackagesService.getPackageDetail(packageNo);
    }

    // 패키지 수정
    @PostMapping("/edit")
    public ResponseEntity<?> updatePackage(@RequestPart("package") PackagesVo vo,
                                           @RequestPart(value = "image", required = false) MultipartFile file) {
        try {
            managerPackagesService.updatePackage(vo, file);
            return ResponseEntity.ok().body("패키지 수정 완료");
        } catch (Exception e) {
            log.error("패키지 수정 중 오류 발생", e);  // 예외 로그 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("패키지 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}

