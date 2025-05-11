import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 특정 오피스의 리뷰 데이터를 API에서 가져오는 Thunk 액션 생성

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

export const fetchReviewsByOfficeNo = createAsyncThunk(
  'review/fetchByOfficeNo',
  async (no, { rejectWithValue }) => {
    const option = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    try {
      const response = await fetch(
        `http://${API_SERVER}/api/office/review?no=${no}`,
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

const reviewSlice = createSlice({
  name: 'review',
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
      .addCase(fetchReviewsByOfficeNo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviewsByOfficeNo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchReviewsByOfficeNo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setReview } = reviewSlice.actions;
export default reviewSlice.reducer;
