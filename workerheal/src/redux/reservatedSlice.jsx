import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reservatedList: [], // ✅ 예약 내역 리스트 저장
};

const reservatedSlice = createSlice({
  name: "reservated",
  initialState,
  reducers: {
    setReservatedList: (state, action) => {
      state.reservatedList = action.payload;
    },
    updateReservatedDetail: (state, action) => {
      const index = state.reservatedList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.reservatedList[index] = action.payload;
      }
    },
  },
});

export const { setReservatedList, updateReservatedDetail } =
  reservatedSlice.actions;
export default reservatedSlice.reducer;
