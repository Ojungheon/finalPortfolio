import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { minus, plus } from '../../redux/addPeopleSlice';

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
  width: 950px;
  height: 1px;
  background-color: #747474;
`;

const CapacityInfo = styled.div`
  display: flex;
  width: 1100px;
  color: #747474;
  font-size: 14px;
  justify-content: flex-end;
  margin: 0px auto;
  margin-top: -18px;
`;

const Counter = styled.div`
  display: flex;
  align-items: center;
  margin: 0px auto;
  justify-content: center;
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

// const AddPeople = ({ setPackageReservation }) => { // 태훈 수정
const AddPeople = ({ setPackageReservation, officePrice }) => {
  const [reservateNum, setReservateNum] = useState();
  const dispatch = useDispatch();
  const { value } = useSelector((state) => {
    return state.peopleCounter;
  });

  useEffect(() => {
    setPackageReservation((prev) => {
      return {
        ...prev,
        reservateNum: value,
        price: value * officePrice, // 오피스 총액 계산 - 태훈 추가가
      };
    });
  }, [value]);

  return (
    <>
      <TitleLayout>
        <Title>
          <FontAwesomeIcon icon={faUser} style={{ color: '#747474' }} />
          인원 선택
        </Title>
        <Line />
      </TitleLayout>
      {/* <CapacityInfo>*최대인원은 {capacity}입니다.</CapacityInfo> */}
      <Counter>
        <Button
          onClick={() => {
            dispatch(minus());
          }}
        >
          -
        </Button>
        <Count>{value}</Count>
        <Button
          onClick={() => {
            dispatch(plus());
          }}
        >
          +
        </Button>
      </Counter>
    </>
  );
};

export default AddPeople;
