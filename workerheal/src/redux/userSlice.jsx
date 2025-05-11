import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: localStorage.getItem("userId") || null, // 🚀 localStorage에서 초기값 가져오기
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem("userId", action.payload); // 🚀 저장
    },
    clearUserId: (state) => {
      state.userId = null;
      localStorage.removeItem("userId"); // 🚀 삭제
    },
  },
});

export const { setUserId, clearUserId } = userSlice.actions;
export default userSlice.reducer;
