package com.dolearndorun.workerheal_app.office.host;

import com.dolearndorun.workerheal_app.office.OfficeService;
import com.dolearndorun.workerheal_app.security.SecurityUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/host/office")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class TempOfficeController {

    private final TempOfficeService tempOfficeService;

    // 호스트 임시 오피스 테이블에 등록
    @PostMapping("insert")
    public void officeEnroll(TempOfficeVo vo , MultipartFile repImage , List<MultipartFile> additionalFiles) throws IOException {

        // SecurityUserDetails 에서 작성자 정보 수집
        SecurityUserDetails khUserDetails = (SecurityUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long writerNo = khUserDetails.getNo();
        vo.setHostNo(writerNo);

        tempOfficeService.officeEnroll(vo, repImage , additionalFiles);
    }

    // 임시 오피스 수정
    @PostMapping("update")
    public void updateOffice(@RequestBody TempOfficeVo vo) {
        tempOfficeService.updateOfficeByNo(vo);
    }

    // 임시 오피스 삭제
    @PostMapping("delete")
    public int deleteOffice(int no){
        int result = tempOfficeService.deleteOffice(no);
        return result;
    }

    // 임시 오피스 테이블 상세조회
    @GetMapping("detail")
    public Map<String, Object> officeDetail(int no){
        TempOfficeVo tempOfficeVo = tempOfficeService.officeDetail(no);
        List<TempOfficeAttachmentVo> tempOfficeAttachmentVo = tempOfficeService.officeAttachmentDetail(no);

        Map<String, Object> result = new HashMap<>();
        result.put("officeInfo", tempOfficeVo);
        result.put("officeAttachmentInfo" , tempOfficeAttachmentVo);
        return result;
    }
}
