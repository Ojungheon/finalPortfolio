import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, getMonth, getYear } from 'date-fns';
import { ko } from 'date-fns/locale';
import '../styles/DateSelector.css';
import { Select, FormControl, IconButton, MenuItem } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useDispatch, useSelector } from 'react-redux';
import {
  setClosedDate,
  setEndDate,
  setStartDate,
  setViewYear,
} from '../../redux/DateSlice';
import { useEffect } from 'react';

/* ################################## 초기 데이터 start ################################## */
// 연도 선택 select box에 보여질 데이터 : range(시작 연도, 끝 연도, 연도 간격)
const _ = require('lodash'); // lodash 라이브러리
const years = _.range(getYear(new Date()) - 1, getYear(new Date()) + 5, 1);

// 월 선택 select box에 보여질 데이터
const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
/* ################################## 초기 데이터 end ################################## */

/* ################################## styled components start ################################## */
const StyledDatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* width: 500px;
  height: 100vh; */

  font-size: ${(props) => props.calfontsize || '20px'};
`;

const InputWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 15em;
  height: 2.5em;
`;

const CustomInput = styled.input`
  width: 9.5em;
  height: 1.7em;
  padding: 4px;
  background-color: #e1e4ed;
  border: none;
  border-radius: 4px;
  /* margin-bottom: 10px; */
  text-align: center;
  font-size: 0.7em;
`;
/* ################################## styled components end ################################## */

/* ################################## DateSelector components ################################## */
const DateSelector = ({ calfontsize, getReservateList }) => {
  /* ########## state 설정 ########## */
  const dispatch = useDispatch();
  const { startDate, endDate, maxDate, viewYear, closedDate, checkedYear } =
    useSelector((state) => state.date);

  /* ##########  날짜 선택 시 기간 시작일, 종료일 , 선택 가능한 최대일 설정(dates: 선택한 날짜) ########## */
  const onChange = (dates) => {
    const [start, end] = dates; // 선택 중인 기간 정보

    if (end == null) {
      const utcDate = new Date(
        start.getTime() - start.getTimezoneOffset() * 60000
      );
      // dispatch(setStartDate(start.toISOString())); // 기간 시작일 설정
      dispatch(setStartDate(utcDate.toISOString())); // 기간 시작일 설정
    } else {
      const utcDate = new Date(end.getTime() - end.getTimezoneOffset() * 60000);
      // dispatch(setEndDate(end.toISOString())); // 기간 종료일 설정
      dispatch(setEndDate(utcDate.toISOString())); // 기간 종료일 설정
    }
  };

  /* ########## 마감일자 목록에 포함된 날짜일 경우 마감속성 부여 ########## */
  const getDayClassName = (date) => {
    const formDate = format(date, 'yyyy-MM-dd');
    if (closedDate.length < 1) {
      return 'custom-day';
    }
    return closedDate.includes(formDate) && date >= new Date()
      ? 'closed-date custom-day'
      : 'custom-day';
  };

  /* ########## 화면에서 마감 된 날짜 Block 처리 ########## */
  const isDateAvailable = (date) => {
    const className = getDayClassName(date);
    return !className.includes('closed-date'); // "closed-date" 클래스가 있으면 비활성화
  };

  /* ########## 현재 보고 있는 캘린더 연도 정보 설정 ########## */
  const checkYearChanege = (year) => {
    const stringYear = year.toString();
    // 연도 값 변경 없으면 설정 종료
    if (viewYear === stringYear) {
      return;
    }
    dispatch(setViewYear(stringYear)); // 연도 바뀌면 store 정보 변경
  };

  /* ########## 예약 만료 일자 정보 수집 ########## */
  useEffect(() => {
    // 첫 화면 렌더링인 경우와 이미 해당 연도 정보 있으면 종료
    if (viewYear == '' || checkedYear.includes(viewYear)) {
      return;
    }

    // 해당 연도의 만료일자 정보 목록 수집
    const getList = getReservateList();

    dispatch(setClosedDate(getList || [])); // 만료일자 리스트에 새로 받아온 데이터 추가
  }, [viewYear]);

  return (
    <StyledDatePickerWrapper calfontsize={calfontsize}>
      {/* ################### 시작일, 종료일 표시란 start ################### */}
      <InputWrap>
        {/* ########## 시작일 start ########## */}
        <CustomInput
          type="text"
          // value={startDate ? startDate.toLocaleDateString() : ''}
          value={startDate ? new Date(startDate).toLocaleDateString() : ''}
          readOnly
          placeholder="시작 일"
        />
        {/* ########## 시작일 end ########## */}

        {/* ########## 기간 표시 start ########## */}
        <div> - </div>
        {/* ########## 기간 표시 둥 ########## */}

        {/* ########## 종료일 start ########## */}
        <CustomInput
          type="text"
          // value={endDate ? endDate.toLocaleDateString() : ''}
          value={endDate ? new Date(endDate).toLocaleDateString() : ''}
          readOnly
          placeholder="종료 일"
        />
        {/* ########## 종료일 end ########## */}
      </InputWrap>
      {/* ################### 시작일, 종료일 표시란 end ################### */}

      {/* ################### 기간 선택 Calendar start ################### */}
      <DatePicker
        // ################### header start ###################
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => {
          /* ########## 현재 보고 있는 화면의 연도 값 체크 ########## */
          checkYearChanege(date.getFullYear());

          return (
            <div
              style={{
                margin: 10,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* ########## 이전 월 버튼 start ########## */}
              <IconButton
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
              >
                <ArrowBackIosIcon sx={{ fontSize: '1em !important' }} />
              </IconButton>
              {/* ########## 이전 월 버튼 end ########## */}

              {/* ########## 연도 선택 리스트 start ########## */}
              <FormControl>
                <Select
                  sx={{ pb: 0, width: '5.0em', fontSize: '0.9em' }}
                  variant="standard"
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // label="Year"
                  value={getYear(date)}
                  onChange={({ target: { value } }) =>
                    changeYear(Number(value))
                  }
                  className="yearBox"
                >
                  {years.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* ########## 연도 선택 리스트 end ########## */}

              {/* ########## 월 선택 리스트 start ########## */}
              <FormControl>
                <Select
                  sx={{ pb: 0, width: '3.3em', fontSize: '0.9em' }}
                  variant="standard"
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // label="Month"
                  value={months[getMonth(date)]}
                  onChange={({ target: { value } }) =>
                    changeMonth(months.indexOf(value))
                  }
                  className="monthBox"
                >
                  {months.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* ########## 월 선택 리스트 end ########## */}

              {/* ########## 다음 월 버튼 start ########## */}
              <IconButton
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
              >
                <ArrowForwardIosIcon sx={{ fontSize: '1em' }} />
              </IconButton>
              {/* ########## 다음 월 버튼 end ########## */}
            </div>
          );
        }}
        // ################### header end ###################
        // ################### Calendar body start ###################
        calendarClassName="custom-datepicker"
        locale={ko} // 한국 로컬 설정
        // dateFormat={'yyyy-MM-dd'} // 날짜 형식
        selectsRange // 기간 선택 형식
        inline // inline으로 바로 보여지도록 설정
        onChange={onChange} // 날짜 선택 시 동작 내용
        startDate={startDate ? new Date(startDate) : ''} // 캘린더 시작 날짜 설정 ?
        endDate={endDate ? new Date(endDate) : ''} // 캘린더 종료 날짜 설정 ?
        dropdownMode="select" // 연도, 월 dropdown 시 표시 형식
        showYearDropdown // 연도 dropdown 표시
        showMonthDropdown // 월 dropwdown 표시
        minDate={new Date()} // 오늘 이전 날짜 선택 불가
        maxDate={maxDate ? new Date(maxDate) : ''} // 최대 선택 가능한 날짜
        dayClassName={getDayClassName} // 날짜 별 클래스 추가
        filterDate={isDateAvailable} // 마감 된 날짜 Block 처리
        // isClearable={true} // input 애서 초기화 버튼 사용
        fixedHeight
        // ################### Calendar body end ###################
      />
      {/* ################### 기간 선택 Calendar end ################### */}
    </StyledDatePickerWrapper>
  );
};

export default DateSelector;
