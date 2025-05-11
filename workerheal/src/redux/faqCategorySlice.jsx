import { createSlice } from '@reduxjs/toolkit';

const faqCategorySlice = createSlice({
  name: 'faqCategory',
  initialState: {
    categories: [], // 여러 개의 카테고리를 저장할 리스트
    selectedCategory: null, //  사용자가 선택한 카테고리 정보
  },
  reducers: {
    setFaqCategories: (state, action) => {
      state.categories = action.payload;
    },
    setFaqCategoryVo: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setFaqCategories, setFaqCategoryVo } = faqCategorySlice.actions;

export default faqCategorySlice.reducer;
