import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    rooms: {}, // ✅ 객실 수량 저장
    officeItems: {}, // ✅ 오피스 물품 수량 저장
  },
  reducers: {
    plus: (state, action) => {
      const { category, id } = action.payload;

      // ✅ category가 없으면 먼저 초기화 (예: state.rooms 또는 state.officeItems)
      if (!state[category]) {
        state[category] = {};
      }

      // ✅ id가 없으면 0으로 초기화 후 증가
      state[category][id] = (state[category][id] ?? 0) + 1;
    },

    minus: (state, action) => {
      const { category, id } = action.payload;

      // ✅ category가 없으면 아무 것도 안 함
      if (!state[category]) return;

      if (state[category][id] && state[category][id] > 0) {
        state[category][id] -= 1;
      }
    },

    initializeRooms: (state, action) => {
      action.payload.forEach((room) => {
        state.rooms[room.no] = 0; // ✅ 모든 객실 초기화
      });
    },
    initializeOfficeItems: (state, action) => {
      action.payload.forEach((item) => {
        state.officeItems[item.id] = 0; // ✅ 모든 오피스 물품 초기화
      });
    },
  },
});

export const { plus, minus, initializeRooms, initializeOfficeItems } =
  counterSlice.actions;
export default counterSlice.reducer;
