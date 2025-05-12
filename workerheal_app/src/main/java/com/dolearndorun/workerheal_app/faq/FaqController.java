package com.dolearndorun.workerheal_app.faq;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("api/faq")
@RequiredArgsConstructor
public class FaqController {

    private final FaqService service;

    // Faq 카테고리 목록 조회
    @GetMapping("category")
    public List<FaqCategoryVo> cateList(){
//        System.out.println("FaqController.cateList");
        List<FaqCategoryVo> result = service.cateList();
//        System.out.println("result " + result);
        return result;
    }

    // Faq 목록 조회
    @GetMapping("{no}")
    public List<FaqVo> list(@RequestParam("categoryNo") int no){
        System.out.println("FaqController.list");
        List<FaqVo> result = service.list(no);
        System.out.println("result = " + result);
        return result;
    }
}
