package com.dolearndorun.workerheal_app.common.option;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/common/option")
@RequiredArgsConstructor
@Slf4j
public class OptionController {

    private final OptionService service;
    
    // 지역 정보 조회
    @GetMapping("region")
    public List<OptionVo> getRegionList(){
        // service 호출
        try {
            return service.getRegionList();
        }catch (Exception e){
            System.out.println("e = " + e);
            throw new IllegalStateException("지역 정보 조회 오류");
        }
    }//getRegionList

    // 편의시설 정보 조회
    @GetMapping("facility")
    public List<FacilityVo> getFacilityList(String productName){

        // service 호출
        try {
            List<FacilityVo> vo =  service.getFacilityList(productName);
            System.out.println("vo = " + vo);
            return service.getFacilityList(productName);
        }catch (Exception e){
            System.out.println("e = " + e);
            throw new IllegalStateException("편의시설 정보 조회 오류");
        }

    }//getFacilityList

    // 관광정보 카테고리 조회 - 태훈
    @GetMapping("tourCategory")
    public List<OptionVo> getTourCategoryList() {

        // service 호출
        try {
            return service.getTourCategoryList();
        } catch (Exception e) {
            System.out.println("e = " + e);
            throw new IllegalStateException("관광정보 카테고리 조회 오류");
        }

    }//getTourCategoryList

}//class
