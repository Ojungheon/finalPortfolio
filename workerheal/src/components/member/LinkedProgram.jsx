import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountainSun } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { setTourTotaPrice } from '../../redux/PackageDetailSlice';

const TitleLayout = styled.div`
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #747474;
  align-items: center;
  flex-direction: row;
  margin: 20px;
`;

const Line = styled.div`
  width: 870px;
  height: 1px;
  background-color: #747474;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 870px;
  margin: 10px auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #8041ff;
  margin-bottom: 5px;
`;

const ProgramName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: black;
`;

const DateSelect = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  background: white;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
`;

const Counter = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  background-color: white;
  border: 1px solid #aaa;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Count = styled.span`
  margin: 0 10px;
  font-size: 20px;
  font-weight: bold;
`;

const LinkedProgram = ({ name, setTourInfo }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [peopleCount, setPeopleCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const { price } = useSelector(
    (state) => state.packageDetail.tourDetail.tourVo
  );

  // const handleIncrease = () => {
  //   setPeopleCount((prev) => prev + 1);
  //   setTotalPrice(peopleCount * price);

  //   console.log('peopleCount ::::::::: ', peopleCount);
  //   console.log('price :::::::::: ', price);
  //   console.log('*** :::::::::::: ', peopleCount * price);
  //   console.log('totalPrice ::::::::::::::::::::::::::::::: ', totalPrice);

  //   setTourInfo((prev) => {
  //     return {
  //       ...prev,
  //       price: totalPrice,
  //     };
  //   });
  // };

  // const handleDecrease = () => {
  //   if (peopleCount > 1) {
  //     setPeopleCount((prev) => prev - 1);
  //   }
  // };

  // useEffect(() => {
  //   setTourInfo((prev) => {
  //     return {
  //       ...prev,
  //       // startDate: startDate.toDateString(),
  //       startDate: format(startDate, 'yyyy-MM-dd'),
  //       endDate: format(endDate, 'yyyy-MM-dd'),
  //       reservateNum: peopleCount,
  //     };
  //   });
  // }, [startDate, endDate, peopleCount]);

  // useEffect(() => {
  //   let total = 0;
  // });

  // 인원 증가
  const handleIncrease = () => {
    setPeopleCount((prev) => prev + 1); // 인원 증가
  };

  //인원 감소
  const handleDecrease = () => {
    setPeopleCount((prev) => (prev > 1 ? prev - 1 : prev)); // 1 이하로 감소하지 않도록 제한
  };

  // peopleCount 변경 시 totalPrice 자동 업데이트
  useEffect(() => {
    setTotalPrice(peopleCount * price); // 최신 인원 수에 맞게 가격 계산
  }, [peopleCount, price]); // price가 바뀔 수도 있으므로 포함

  // 일정 변경 또는 인원 변경 시 setTourInfo 업데이트
  useEffect(() => {
    setTourInfo((prev) => ({
      ...prev,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      reservateNum: peopleCount,
      price: totalPrice, // 최신 가격 반영
    }));
  }, [startDate, endDate, peopleCount, totalPrice]); // totalPrice 변경 시에도 업데이트

  return (
    <>
      <TitleLayout>
        <Title>
          <FontAwesomeIcon icon={faMountainSun} style={{ color: '#747474' }} />
          연계 프로그램 신청
        </Title>
        <Line />
      </TitleLayout>

      <Container>
        {/* 왼쪽 (희망 프로그램) */}
        <Column>
          <SubTitle>희망 프로그램</SubTitle>
          <ProgramName>{name}</ProgramName>
        </Column>

        {/* 가운데 (일정 선택) */}
        <Column>
          <SubTitle>일정</SubTitle>
          <DateSelect>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
            />
            {' ~ '}
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
            />
          </DateSelect>
        </Column>

        {/* 오른쪽 (인원 선택) */}
        <Column>
          <SubTitle>인원</SubTitle>
          <Counter>
            <Button onClick={handleDecrease} disabled={peopleCount === 1}>
              -
            </Button>
            <Count>{peopleCount}</Count>
            <Button onClick={handleIncrease}>+</Button>
          </Counter>
        </Column>
      </Container>
    </>
  );
};

export default LinkedProgram;
