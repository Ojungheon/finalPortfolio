import { createSlice } from '@reduxjs/toolkit';

const mainPackageList = createSlice({
  name: 'mainPackage',
  initialState: {
    packageList: [],
  },
  reducers: {
    setPackageList: (state, action) => {
      state.packageList = action.payload;
    },
  },
});

export const { setPackageList } = mainPackageList.actions;
export default mainPackageList.reducer;
