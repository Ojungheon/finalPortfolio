import { createSlice } from '@reduxjs/toolkit';

const officeDetailedSlice = createSlice({
  name: 'officeDetailed',
  initialState: {
    officeInfo: {}, // 오피스 정보
    officeAttachments: [], // 오피스 첨부파일
    reviews: [], // 해당 오피스의 리뷰 리스트
    reviewAttachments: [], // 오피스 리뷰 첨부파일
  },

  reducers: {
    setOfficeDetailed: (state, action) => {
      console.log('Redux 액션 호출됨, payload:', action.payload);
      // undefind 또는 null 값이여도 오류없이 빈 객체로 들어가도로 설정
      state.officeInfo = action.payload.officeInfo || {};
      state.officeAttachments = action.payload.officeAttachments || [];
      state.reviews = action.payload.reviews || [];
      state.reviewAttachments = action.payload.reviewAttachments || [];
    },
  },
});

export const { setOfficeDetailed } = officeDetailedSlice.actions;
export default officeDetailedSlice.reducer;
