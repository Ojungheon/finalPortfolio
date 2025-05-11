import { createSlice } from '@reduxjs/toolkit';

const storedCategory = localStorage.getItem('selectedCategory');

const tourSlice = createSlice({
  name: 'tour',
  initialState: {
    tourList: [],
    selectedCategory: storedCategory ? Number(storedCategory) : 1, // 로컬스토리지 값 사용
    // pno: 0,
    pno: 1,
    hasMore: true,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      console.log('[setSelectedCategory] 카테고리 변경:', action.payload);

      state.selectedCategory = action.payload ?? 1;
      localStorage.setItem('selectedCategory', state.selectedCategory);
      state.tourList = [];
      state.pno = 1;
      state.hasMore = true;

      console.log('[setSelectedCategory] 업데이트된 상태:', state);
    },
    plusPno: (state) => {
      state.pno++;
    },
    appendTours: (state, action) => {
      state.tourList = [...state.tourList, ...action.payload];
    },
    tourVo: (state, action) => {
      state.tourList = action.payload;
    },
  },
});

export const { setSelectedCategory, plusPno, appendTours, tourVo } =
  tourSlice.actions;
export default tourSlice.reducer;
