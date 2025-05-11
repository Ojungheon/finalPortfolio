import { createSlice } from '@reduxjs/toolkit';

// 리덕스 상태 만들기 -> createSlice는 리덕스의 상태, 액션, 리듀서를 한꺼번에 만들 수 있는 함수임
const searchSlice = createSlice({
  name: 'search', // 리덕스에서 사용할 slice 이름

  // 상태(state) 초기값 설정
  initialState: {
    keyword: '', // 빈 문자열이 기본값, 사용자가 입력한 검색어가 들어옴
    category: '', // 검색 대상 (기본값-오피스 검색)
    data: [],
  },
  // 상태를 변경하는 함수
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload; // 검색어 변경
    },
    setCategory: (state, action) => {
      state.category = action.payload; // 검색 대상 변경
    },
    setSearchData: (state, action) => {
      state.data = action.payload; // API에서 가져온 데이터 저장
    },
  },
});

export const { setKeyword, setCategory, setSearchData } = searchSlice.actions; // 액션 내보내기
export default searchSlice.reducer;
