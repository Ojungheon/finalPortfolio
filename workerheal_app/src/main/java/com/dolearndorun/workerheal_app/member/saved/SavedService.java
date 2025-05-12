package com.dolearndorun.workerheal_app.member.saved;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SavedService {

    private final SavedMapper savedMapper;

    //찜 목록 조회
    public List<SavedVo> getSavedList(Long memberNo) {
        return savedMapper.getSavedList(memberNo);
    }
    //찜 목록 삭제
    public void deleteSavedItem(Long memberNo, String name, String productType) {
        int result = savedMapper.deleteSavedItem(memberNo, name, productType);
        if (result == 0) {
            throw new RuntimeException("삭제할 항목이 존재하지 않습니다.");
        }
    }


}
