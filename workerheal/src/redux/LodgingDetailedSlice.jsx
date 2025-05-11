import { createSlice } from '@reduxjs/toolkit';

const lodgingDetailedSlice = createSlice({
  name: 'lodgingDetailed',
  initialState: {
    lodgingInfo: {}, // 숙소 기본 정보
    facilitie: [], // 숙소에 등록된 시설 코드
    attachments: [], // 숙소 첨부파일
    roomTypes: [], // 객실 타입 목록
    roomAttachments: [], // 객실 첨부파일 목록
    reviews: [], // 리뷰 목록
    reviewAttachments: [], // 리뷰 첨부파일 목록
  },
  reducers: {
    setLodgingDetailed: (state, action) => {
      console.log('Redux 업데이트됨! payload:', action.payload);
      state.lodgingInfo = action.payload.lodgingInfo || {};
      state.facilitie = action.payload.facilitie || [];
      state.attachments = action.payload.attachments || [];
      state.roomTypes = action.payload.roomTypes || [];
      state.roomAttachments = action.payload.roomAttachments || [];
      state.reviews = action.payload.reviews || [];
      state.reviewAttachments = action.payload.reviewAttachments || [];
    },
  },
});

export const { setLodgingDetailed } = lodgingDetailedSlice.actions;
export default lodgingDetailedSlice.reducer;
