import { createSlice } from "@reduxjs/toolkit";

// ✅ 초기 상태 (호스트 정보 저장)
const initialState = {
  host: null, // 로그인한 호스트 정보
  hostId: localStorage.getItem("hostId") || null, // 🚀 비밀번호 찾기 등에 사용되는 호스트 ID
};

// ✅ 호스트 슬라이스 생성
const hostSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    // ✅ 호스트 로그인 시 정보 저장
    setHost: (state, action) => {
      state.host = action.payload;
    },
    // ✅ 호스트 ID 저장 (비밀번호 찾기 등)
    setHostId: (state, action) => {
      state.hostId = action.payload;
      localStorage.setItem("hostId", action.payload); // 🚀 저장
    },
    // ✅ 호스트 ID 초기화
    clearHostId: (state) => {
      state.hostId = null;
      localStorage.removeItem("hostId"); // 🚀 삭제
    },
    // ✅ 호스트 로그아웃
    logoutHost: (state) => {
      state.host = null;
      state.hostId = null;
      localStorage.removeItem("hostId"); // 🚀 로그아웃 시 호스트 ID 삭제
    },
  },
});

// ✅ 액션 및 리듀서 내보내기
export const { setHost, setHostId, clearHostId, logoutHost } = hostSlice.actions;
export default hostSlice.reducer;
