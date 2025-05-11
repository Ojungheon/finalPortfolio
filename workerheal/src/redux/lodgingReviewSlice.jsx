import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// 특정 오피스의 리뷰 데이터를 API에서 가져오는 Thunk 액션 생성
export const reviewsByLodgingeNo = createAsyncThunk(
  'review/reviewsByLodgingeNo',
  async (no, { rejectWithValue }) => {
    const option = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    try {
      const response = await fetch(
        `http://${API_SERVER}/api/lodging/review?no=${no}`,
        option
      );
      if (!response.ok)
        throw new Error('리뷰 데이터를 불러오는 데 실패했습니다.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const lodgingReviewSlice = createSlice({
  name: 'lodgingReview',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setReview: (state, action) => {
      console.log('🚀 Redux Review 액션 호출됨, payload:', action.payload);
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reviewsByLodgingeNo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(reviewsByLodgingeNo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(reviewsByLodgingeNo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setReview } = lodgingReviewSlice.actions;
export default lodgingReviewSlice.reducer;
