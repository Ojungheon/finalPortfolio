import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';

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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const SubTitle = styled.div`
  color: #8041ff;
  font-size: 16px;
  font-weight: bold;
`;

const InputBox = styled.div`
  background-color: #c9c9c9;
  border-radius: 5px;
  padding: 7px;
`;

const ReservationInfo = ({ name, phone }) => {
  return (
    <>
      <TitleLayout>
        <Title>
          <FontAwesomeIcon icon={faUserPen} style={{ color: '#747474' }} />
          예약자 정보
        </Title>
        <Line />
      </TitleLayout>
      <UserInfo>
        <SubTitle>예약자 성함</SubTitle>
        <InputBox>{name}</InputBox>
        <SubTitle>예약자 전화번호</SubTitle>
        <InputBox>{phone}</InputBox>
      </UserInfo>
    </>
  );
};

export default ReservationInfo;
