package com.dolearndorun.workerheal_app.faq;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FaqService {

    private final FaqMapper mapper;

    // FAQ 카테고리 리스트
    public List<FaqCategoryVo> cateList() {
        return mapper.cateList();
    }

    // 카테고리마다 등록된 질문과 답변 리스트
    public List<FaqVo> list(@RequestParam("categoryNo") int no) {
        System.out.println("FaqService.list");
        return mapper.list(no);
    }


}
