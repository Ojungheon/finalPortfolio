import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedLodging: null,
  selectedOffice: null,
  selectedProgram: null,
  image: null, // 이미지 파일 상태
  packageNo: null,
};

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    setSelectedLodging: (state, action) => {
      state.selectedLodging = action.payload;
    },
    setSelectedOffice: (state, action) => {
      state.selectedOffice = action.payload;
    },
    setSelectedProgram: (state, action) => {
      state.selectedProgram = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setPackageNo: (state, action) => {
      state.packageNo = action.payload; // 패키지 번호를 설정하는 액션
    },
    resetPackage: () => initialState,
  },
});

export const {
  setSelectedLodging,
  setSelectedOffice,
  setSelectedProgram,
  setImage,
  setPackageNo,
  resetPackage,
} = packageSlice.actions;
export default packageSlice.reducer;
