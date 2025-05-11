import { createSlice } from '@reduxjs/toolkit';

const officeSlice = createSlice({
  name: 'office',
  initialState: {
    officeList: [], // 데이터 리스트로 받아오기
    pno: 1,
  },
  reducers: {
    officeVo: (state, action) => {
      state.officeList = action.payload;
    },
    plusPno: (state) => {
      state.pno++;
    },
  },
});

export const { officeVo, plusPno } = officeSlice.actions;
export default officeSlice.reducer;
