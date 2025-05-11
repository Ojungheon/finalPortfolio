import { createSlice } from "@reduxjs/toolkit";

// ✅ 초기 상태 (매니저 정보 저장)
const initialState = {
  manager: null, // 로그인한 매니저 정보
  managerId: localStorage.getItem("managerId") || null, // 🚀 비밀번호 찾기 등에 사용되는 매니저 ID
};

// ✅ 매니저 슬라이스 생성
const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    // ✅ 매니저 로그인 시 정보 저장
    setManager: (state, action) => {
      state.manager = action.payload;
    },
    // ✅ 매니저 ID 저장 (비밀번호 찾기 등)
    setManagerId: (state, action) => {
      state.managerId = action.payload;
      localStorage.setItem("managerId", action.payload); // 🚀 저장
    },
    // ✅ 매니저 ID 초기화
    clearManagerId: (state) => {
      state.managerId = null;
      localStorage.removeItem("managerId"); // 🚀 삭제
    },
    // ✅ 매니저 로그아웃
    logoutManager: (state) => {
      state.manager = null;
      state.managerId = null;
      localStorage.removeItem("managerId"); // 🚀 로그아웃 시 매니저 ID 삭제
    },
  },
});

// ✅ 액션 및 리듀서 내보내기
export const { setManager, setManagerId, clearManagerId, logoutManager } = managerSlice.actions;
export default managerSlice.reducer;
