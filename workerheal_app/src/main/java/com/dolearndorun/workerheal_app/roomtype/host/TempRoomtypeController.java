package com.dolearndorun.workerheal_app.roomtype.host;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/host/tempRoomtype")
@RequiredArgsConstructor
public class TempRoomtypeController {

    private final TempRoomtypeService roomtypeService;

    @GetMapping("list")
    public List<TempRoomtypeVo> list(@RequestParam("lodgingNo") int lodgingNo){
        return roomtypeService.select(lodgingNo);
    }

    // 호스트 임시 객실 테이블에 등록
    @PostMapping("insert")
    public void roomTypeEnroll(TempRoomtypeVo vo , MultipartFile repImage , List<MultipartFile> addtionalFiles) throws IOException {

        roomtypeService.roomTypeEnroll(vo , repImage , addtionalFiles);

    }

    // 임시 객실 상세 조회
    @GetMapping("detail")
    public Map<String, Object> roomTypeDetail(Long no){
        TempRoomtypeVo tempRoomtypeVo = roomtypeService.roomTypeDetail(no);
        List<TempRoomtypeAttachmentVo> tempRoomtypeAttachmentVo = roomtypeService.roomTypeAttachmentDetail(no);

        Map<String, Object> result = new HashMap<>();
        result.put("roomTypeInfo" , tempRoomtypeVo);
        result.put("roomTypeAttachmentInfo" , tempRoomtypeAttachmentVo);
        return result;
    }
}
