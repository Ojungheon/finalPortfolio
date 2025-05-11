import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setLodgingTotaPrice } from '../../redux/PackageDetailSlice';

const TitleLayout = styled.div`
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

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 954px;
  height: auto;
  border: 1px solid #747474;
  border-radius: 15px;
  overflow: hidden;
  margin: 0px auto;
`;

const TitleDiv = styled.div`
  display: flex;
  height: 60px;
  width: 100%;
  align-items: center;
  background-color: #8041ff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const Text = styled.div`
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-left: 25px;
`;

const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  padding: 15px;
  gap: 10px;
`;

const RoomItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  width: 93%;
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
  font-size: 16px;
`;

const TotalPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-top: 15px;
  text-align: center;
`;

const PackageRoomSelect = ({ rooms }) => {
  console.log('전달된 rooms 데이터:', rooms);
  const dispatch = useDispatch();

  // 객실 타입별 선택 수량을 관리하는 상태
  const [roomCounts, setRoomCounts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  // rooms가 변경될 때 초기화
  useEffect(() => {
    if (Array.isArray(rooms) && rooms.length > 0) {
      const initialCounts = {};
      rooms.forEach((room) => {
        initialCounts[room.no] = 0; // 초기값 0 설정
      });
      setRoomCounts(initialCounts);
    }
  }, [rooms]);

  // 총 가격 계산 (선택된 객실 타입 수량 * 개별 가격)
  useEffect(() => {
    let total = 0;
    rooms.forEach((room) => {
      total += (roomCounts[room.no] ?? 0) * room.price;
    });
    setTotalPrice(total);
    dispatch(setLodgingTotaPrice(total));
  }, [roomCounts, rooms]);

  // 수량 증가
  const handlePlus = (roomNo) => {
    setRoomCounts((prevCounts) => ({
      ...prevCounts,
      [roomNo]: (prevCounts[roomNo] ?? 0) + 1,
    }));
  };

  // 수량 감소 (최소 0 유지)
  const handleMinus = (roomNo) => {
    setRoomCounts((prevCounts) => ({
      ...prevCounts,
      [roomNo]: Math.max(0, (prevCounts[roomNo] ?? 0) - 1),
    }));
  };

  return (
    <>
      <TitleLayout>
        <Title>
          <FontAwesomeIcon icon={faCalendarDays} style={{ color: '#747474' }} />
          객실 선택
        </Title>
        <Line />
      </TitleLayout>

      <SelectContainer>
        <TitleDiv>
          <Text>객실 선택</Text>
        </TitleDiv>

        <RoomList>
          {(rooms ?? []).map((room) => (
            <RoomItem key={room.no}>
              <div>
                <strong>{room.name}</strong>
                <p>
                  가격:{' '}
                  {room.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  원
                </p>
              </div>
              <Counter>
                <Button
                  onClick={() => handleMinus(room.no)}
                  disabled={roomCounts[room.no] === 0}
                >
                  -
                </Button>
                <Count>{roomCounts[room.no] ?? 0}</Count>
                <Button onClick={() => handlePlus(room.no)}>+</Button>
              </Counter>
            </RoomItem>
          ))}
        </RoomList>
      </SelectContainer>

      <TotalPrice>총 가격: {totalPrice.toLocaleString()}원</TotalPrice>
    </>
  );
};

export default PackageRoomSelect;
