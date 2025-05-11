import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  member: JSON.parse(sessionStorage.getItem('member')) || null,
};

const memberSlice = createSlice({
  name: "member",
  initialState: {
    member: JSON.parse(sessionStorage.getItem('member')) || null,
  },
  reducers: {
    setMember: (state, action) => {
      state.member = action.payload;
      sessionStorage.setItem('member', JSON.stringify(action.payload));
    },
    logoutMember: (state) => {
      state.member = null;
      sessionStorage.removeItem('member');
      sessionStorage.removeItem('token');
    },
    resetMemberState: (state) => {
      state.member = null;
      sessionStorage.removeItem('member');
      sessionStorage.removeItem('token');
    },
  },
});

export const { setMember, logoutMember, resetMemberState } = memberSlice.actions;
export default memberSlice.reducer;
