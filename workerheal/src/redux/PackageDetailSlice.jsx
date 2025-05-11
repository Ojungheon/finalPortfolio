import { createSlice } from '@reduxjs/toolkit';

const PackageDetailSlice = createSlice({
  name: 'packageDetail',
  initialState: {
    packageInfo: {},
    packAttach: [],
    reviewVo: [],
    reviewAttach: [],

    officeDetail: {},
    officeAttach: [],

    lodgingDetail: {},
    lodgingAttach: [],
    lodgingReservation: {},
    roomTypeVo: [],
    roomTypeAttach: [],

    tourDetail: {},
  },
  reducers: {
    setPackageDetailed: (state, action) => {
      console.log('📌 action.payload:', action.payload);
      console.log('📌 reviewAttach:', action.payload.reviewAttach);

      state.packageInfo = action.payload.packageInfo || {};
      state.packAttach = action.payload.packAttach || [];
      state.reviewVo = action.payload.reviewVo || [];
      state.reviewAttach = action.payload.reviewAttach || [];

      state.officeDetail = action.payload.officeDetail || {};
      state.officeAttach = action.payload.officeAttach || [];

      state.lodgingDetail = action.payload.lodgingDetail || {};
      state.lodgingAttach = action.payload.lodgingAttach || [];

      state.lodgingReservation = action.payload.lodgingReservation || {};
      state.roomTypeVo = action.payload.roomTypeVo || [];
      state.roomTypeAttach = action.payload.roomTypeAttach || [];

      state.tourDetail = action.payload.tourDetail || {};
    },
    setLodgingTotaPrice: (state, action) => {
      state.lodgingDetail.price = action.payload || 0;
    },
    setTourTotaPrice: (state, action) => {
      state.tourDetail.tourVo.price = action.payload || 0;
    },
  },
});

export const { setPackageDetailed, setLodgingTotaPrice, setTourTotaPrice } =
  PackageDetailSlice.actions;
export default PackageDetailSlice.reducer;
