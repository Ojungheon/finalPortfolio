package com.dolearndorun.workerheal_app.roomtype.host;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/host/roomtype")
@RequiredArgsConstructor
public class RoomtypeController {

    private final RoomtypeService roomtypeService;

    @GetMapping("list")
    public List<RoomtypeVo> list(@RequestParam("lodgingNo") Long lodgingNo){
        return roomtypeService.select(lodgingNo);
    }
}
