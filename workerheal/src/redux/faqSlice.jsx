import { createSlice } from '@reduxjs/toolkit';

const faqSlice = createSlice({
  name: 'faq',
  initialState: {
    faqList: [], // 특정 카테고리의 FAQ 리스트 저장
    selectedFaq: null, // 사용자가 선택한 질문 저장
  },
  reducers: {
    setFaqVo: (state, action) => {
      state.faqList = action.payload; // 특정 카테고리의 질문 리스트 저장
    },
    setSelectedFaq: (state, action) => {
      state.selectedFaq = action.payload; // 사용자가 선택한 질문 저장
    },
  },
});

export const { setFaqVo, setSelectedFaq } = faqSlice.actions;
export default faqSlice.reducer;
