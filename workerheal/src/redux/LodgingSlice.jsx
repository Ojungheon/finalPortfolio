import { createSlice } from '@reduxjs/toolkit';

const lodgingSlice = createSlice({
  name: 'lodging',
  initialState: {
    lodgingList: [],
    pno: 1,
  },
  reducers: {
    lodgingVo: (state, action) => {
      state.lodgingList = action.payload;
    },
    plusPno: (state) => {
      state.pno++;
    },
  },
});

export const { lodgingVo, plusPno } = lodgingSlice.actions;
export default lodgingSlice.reducer;
