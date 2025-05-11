import { createSlice } from '@reduxjs/toolkit';

const addPeopleSlice = createSlice({
  name: 'peopleCounter',
  initialState: { value: 0 },
  reducers: {
    plus: (state) => {
      state.value += 1;
    },
    minus: (state) => {
      if (state.value > 0) {
        state.value -= 1;
      }
    },
  },
});

export const { plus, minus } = addPeopleSlice.actions;
export default addPeopleSlice.reducer;
