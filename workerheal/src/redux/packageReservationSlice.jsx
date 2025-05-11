import { createSlice } from '@reduxjs/toolkit';

const packageReservationSlice = createSlice({
  name: 'packageReservation',
  initialState: {
    packageNo: null,
    memberNo: null,
    office: {
      officeNo: null,
      reservateNum: 0,
      price: 0,
    },
    lodging: {
      lodgingNo: null,
      price: 0,
    },
    tour: {
      tourNo: null,
      price: 0,
    },
    totalPrice: 0,
  },
  reducers: {
    setPackageReservationData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetPackageReservation: () => initialState,
  },
});

export const { setPackageReservationData, resetPackageReservation } =
  packageReservationSlice.actions;
export default packageReservationSlice.reducer;
