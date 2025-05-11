import { createSlice } from '@reduxjs/toolkit';

const packageReviewSlice = createSlice({
  name: 'packageReview',
  initialState: {
    reviews: [],
    reviewAttachment: [],
  },
  reducers: {
    setReview: (state, action) => {
      console.log('🚀 Redux Review 액션 호출됨, payload:', action.payload);
      console.log(
        '🚀 Redux Review 액션 호출됨, payload:',
        action.payload.reviews
      );
      state.reviews = action.payload.reviews || [];
      state.reviewAttachment = action.payload.reviewAttachment || [];
    },
  },
});

export const { setReview } = packageReviewSlice.actions;
export default packageReviewSlice.reducer;
