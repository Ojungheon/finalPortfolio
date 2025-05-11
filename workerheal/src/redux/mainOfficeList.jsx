import { createSlice } from '@reduxjs/toolkit';

const mainOfficeList = createSlice({
  name: 'mainOffice',
  initialState: {
    officeList: [],
  },
  reducers: {
    setOfficeList: (state, action) => {
      state.officeList = action.payload;
    },
  },
});

export const { setOfficeList } = mainOfficeList.actions;
export default mainOfficeList.reducer;
