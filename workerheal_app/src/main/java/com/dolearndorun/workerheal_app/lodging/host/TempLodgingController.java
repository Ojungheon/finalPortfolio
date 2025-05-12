package com.dolearndorun.workerheal_app.lodging.host;

import com.amazonaws.services.s3.AmazonS3;
import com.dolearndorun.workerheal_app.jwt.JwtUtil;
import com.dolearndorun.workerheal_app.security.SecurityUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/host/lodging")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class TempLodgingController {

    private final TempLodgingService lodgingService;
    private final AmazonS3 s3;
    private final JwtUtil jwtUtil;

    @Value("${aws.s3.bucket")
    private String bucket;

    // 호스트가 임시 숙소 테이블에서 목록 조회
    @GetMapping("list")
    public ResponseEntity<List<TempLodgingVo>> findAll(@RequestParam(defaultValue = "1") int pno){
        try{
            List<TempLodgingVo> result = lodgingService.findAll(pno);
            return ResponseEntity.ok().body(result);
        }catch (Exception e){
            log.error(e.getMessage());
            throw new IllegalStateException("[LODGING-LIST] FAIL ...");
        }
    }

    // 임시 숙소 테이블 상세 조회
    @GetMapping("detail")
    public Map<String, Object> lodgingDetail(int no){
        TempLodgingVo tempLodgingVo = lodgingService.lodgingDetail(no);
        List<TempLodgingAttachmentVo> tempLodgingAttachmentVo = lodgingService.lodgingAttachmentDetail(no);

        Map<String, Object> result = new HashMap<>();
        result.put("lodgingInfo" , tempLodgingVo);
        result.put("lodgingAttachmentInfo" , tempLodgingAttachmentVo);
        return result;
    }

    // 임시 숙소 수정
    @PostMapping("update")
    public void updateLodging(@RequestBody TempLodgingVo vo) {
        lodgingService.updateLodgingByNo(vo);
    }

    // 호스트가 임시 숙소 테이블에 등록
    @PostMapping("insert")
    public void lodgingEnorll(TempLodgingVo vo , MultipartFile repImage,  List<MultipartFile> additionalFiles ) throws IOException {

        // SecurityUserDetails 에서 작성자 정보 수집
        SecurityUserDetails khUserDetails = (SecurityUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long writerNo = khUserDetails.getNo();
        vo.setHostNo(writerNo);

        lodgingService.lodgingEnroll(vo, repImage, additionalFiles);
    }

    // 임시 숙소 삭제
    @PostMapping("delete")
    public int lodgingDelete(int no){
        int result = lodgingService.lodgingDelete(no);
        return result;
    }
}

