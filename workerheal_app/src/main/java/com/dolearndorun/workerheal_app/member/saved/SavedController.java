package com.dolearndorun.workerheal_app.member.saved;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/member/saved")
@RequiredArgsConstructor
@Slf4j
public class SavedController {

    private final SavedService savedService;

    //찜 리스트 조회
    @GetMapping("/{memberNo}")
    public List<SavedVo> getSavedItems(@PathVariable Long memberNo) {
        return savedService.getSavedList(memberNo);
    }
    //찜 삭제
    @DeleteMapping("/{memberNo}")
    public ResponseEntity<String> deleteSavedItem(@PathVariable Long memberNo, @RequestBody Map<String, String> request) {
        String name = request.get("name");
        String productType = request.get("productType");

        System.out.println("🔍 DELETE 요청 데이터: " + name + ", " + productType);


        try {
            savedService.deleteSavedItem(memberNo, name, productType);
            return ResponseEntity.ok("찜 해제 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("찜 해제 실패: " + e.getMessage());
        }
    }


}
