import { createSlice } from '@reduxjs/toolkit';

const DateSlice = createSlice({
  name: 'date', // 리덕스에서 사용할 slice 이름

  // 상태(state) 초기값 설정
  initialState: {
    startDate: '',
    endDate: '',
    maxDate: '',
    viewYear: '',
    closedDate: [],
    checkedYear: [],
  },

  // 상태를 변경하는 함수
  reducers: {
    // 기간 선택 - 시작일
    setStartDate: (state, action) => {
      console.log(
        'aaaaaaaaaaaaaaaa ::::::::::::::::::::::::::: ',
        action.payload
      );
      state.startDate = action.payload; // 시작이 설정
      state.endDate = ''; // 시작일 설정 시 종료일 초기화

      // 마감일자 정보 없으면 선택 가능 최대 일자 설정없이 종료
      if (state.closedDate.length < 1) {
        return;
      }

      // 마감일자 배열에서 선택한 날짜와 가장 가까운 마감일자 확인
      const tempDate = new Date(state.startDate); // 날짜 비교 위해 다시 Date 형으로 변환
      for (let i = state.closedDate.length - 1; i >= 0; i--) {
        const checkDate = new Date(state.closedDate[i]);
        if (tempDate > checkDate) {
          const tempMaxDate = new Date(state.closedDate[i + 1]);
          state.maxDate = tempMaxDate.toISOString(); // 선택 가능 최대 일자 설정
          break;
        }
      }
    },
    // 기간 선택 - 종료일
    setEndDate: (state, action) => {
      console.log(
        'aaaaaaaaaaaaaaaa ::::::::::::::::::::::::::: ',
        action.payload
      );

      state.endDate = action.payload;
      // 종료일 선택 된 경우 선택 가능 최대 일자 초기화
      if (state.endDate != '') {
        state.maxDate = '';
      }
    },
    // 기간 선택 시 선택 가능한 최대 일자 설정
    setMaxDate: (state, action) => {
      state.maxDate = action.payload;
    },
    setViewYear: (state, action) => {
      state.viewYear = action.payload;
    },
    // 예약 마감 목록 설정
    setClosedDate: (state, action) => {
      state.closedDate = [...state.closedDate, ...action.payload];
      state.closedDate.sort();
      state.checkedYear = [...state.checkedYear, state.viewYear]; // 조회한 예약 마감 목록에 조회한 연도 추가
    },
    // slice 데이터 초기화
    resetSelector: (state) => {
      state.startDate = '';
      state.endDate = '';
      state.maxDate = '';
      state.viewYear = '';
      state.closedDate = [];
      state.checkedYear = [];
    },
  },
});

export const {
  setStartDate,
  setEndDate,
  setMaxDate,
  setViewYear,
  setClosedDate,
  resetSelector,
} = DateSlice.actions;
export default DateSlice.reducer;
