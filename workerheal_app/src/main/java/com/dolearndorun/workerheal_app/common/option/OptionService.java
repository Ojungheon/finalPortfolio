package com.dolearndorun.workerheal_app.common.option;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OptionService {

    private final OptionMapper mapper;

    // 지역 정보 조회
    public List<OptionVo> getRegionList() {
        return mapper.getRegionList();
    }//getRegionList

    // 편의시설 정보 조회
    public List<FacilityVo> getFacilityList(String productName) {
        return mapper.getFacilityList(productName);
    }//getFacilityList

    // 관광정보 카테고리 조회 - 태훈
    public List<OptionVo> getTourCategoryList() {
        return mapper.getTourCategoryList();
    }//getTourCategoryList

}//class
