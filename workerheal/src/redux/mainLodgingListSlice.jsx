import { createSlice } from '@reduxjs/toolkit';

const mainLodgingListSlice = createSlice({
  name: 'mainLodging',
  initialState: {
    lodingList: [],
  },
  reducers: {
    setLodgingList: (state, action) => {
      state.lodingList = action.payload;
    },
  },
});

export const { setLodgingList } = mainLodgingListSlice.actions;
export default mainLodgingListSlice.reducer;
