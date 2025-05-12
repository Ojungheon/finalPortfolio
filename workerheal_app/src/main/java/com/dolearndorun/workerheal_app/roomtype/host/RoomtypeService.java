package com.dolearndorun.workerheal_app.roomtype.host;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomtypeService {

    private final RoomtypeMapper roomtypeMapper;

    public List<RoomtypeVo> select(Long lodgingNo) {
        return roomtypeMapper.sellect(lodgingNo);
    }
}
