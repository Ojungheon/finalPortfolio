import { createSlice } from '@reduxjs/toolkit';

const tourDetailedSlice = createSlice({
  name: 'tourDetailed',
  initialState: {
    tourInfo: {}, // 관광지 정보
  },

  reducers: {
    setTourDetailed: (state, action) => {
      console.log('✅ Redux 액션 호출됨, payload:', action.payload);
      state.tourInfo = action.payload;
    },
  },
});

export const { setTourDetailed } = tourDetailedSlice.actions;
export default tourDetailedSlice.reducer;
