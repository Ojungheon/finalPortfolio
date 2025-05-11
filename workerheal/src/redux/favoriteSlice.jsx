import { createSlice } from '@reduxjs/toolkit';

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: { favorites: [] }, // 배열로 저장
  reducers: {
    // 찜 추가
    addFavorite: (state, action) => {
      const { no, type } = action.payload; // 숙소, 오피스 인지 받아오기
      if (!state.favorites.some((e) => e.no === no && e.type === type)) {
        state.favorites.push(action.payload);
      }
    },

    // 찜 삭제
    removeFavorite: (state, action) => {
      const { no, type } = action.payload;
      state.favorites = state.favorites.filter(
        (e) => !(e.no === no && e.type === type)
      );
    },
    // 서버에서 받은 찜 목록 저장
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    // 로그아웃시 목록 초기화
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites, clearFavorites } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
