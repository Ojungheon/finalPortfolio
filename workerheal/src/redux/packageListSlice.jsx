import { createSlice } from '@reduxjs/toolkit';

const packageListSlice = createSlice({
  name: 'packageList',
  initialState: {
    packageInfo: [],
    pno: 1,
  },
  reducers: {
    setPackageList: (state, action) => {
      console.log('Redux 액션 호출됨, payload:', action.payload);
      state.packageInfo = action.payload || [];
    },
    plusPno: (state) => {
      state.pno++;
    },
  },
});

export const { setPackageList, plusPno } = packageListSlice.actions;
export default packageListSlice.reducer;
