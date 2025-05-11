import React, { useState } from 'react';
import styled from 'styled-components';

const RoomContainer = styled.div`
  display: flex;
  width: 1000px;
  height: 290px;
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
  gap: 10px;
`;

const ImageWrapper = styled.div`
  width: 420px;
  height: 250px;
  margin-top: 20px;
  margin-left: 25px;

  img {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const InfoContainer = styled.div`
  padding: 20px;
  width: 500px;
`;

const TypeName = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 25px;
  font-weight: bolder;
`;

const DetailEx = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: -20px;
`;

const RoomFeature = styled.div`
  display: flex;
  font-size: 15px;
  color: #747474;
  align-items: center;
  margin-bottom: -15px;

  & > p {
    color: #8041ff;
    margin-right: 15px;
    font-weight: bold;
  }
`;

const Price = styled.div`
  display: flex;
  color: #8041ff;
  font-size: 35px;
  font-weight: bold;
  align-items: flex-end;
  flex-direction: column;
  margin-top: -41px;

  & > p {
    font-size: 20px;
  }
`;
const DetaileButton = styled.div`
  display: flex;
  justify-content: end;
  font-size: 15px;
  color: gray;
  font-weight: bold;
  border: none;
  background-color: white;
  margin-bottom: 15px;
`;

const RoomType = ({
  typeImage,
  typeName,
  bedType,
  amenitie,
  time,
  price,
  onClick,
}) => {
  return (
    <RoomContainer>
      <ImageWrapper>
        <img src={typeImage} alt="숙소 이미지" />
      </ImageWrapper>

      <InfoContainer>
        {/* "상세보기" 버튼 클릭 시 onClick 실행 */}
        <DetaileButton onClick={onClick}>상세보기 {'>'}</DetaileButton>

        <TypeName>{typeName}</TypeName>
        <DetailEx>
          <RoomFeature>
            <p>침대</p>
            {bedType}
          </RoomFeature>
          <RoomFeature>
            <p>어메니티</p>
            {/* {amenitie 태훈 수정 */}
            {amenitie == null ? '' : amenitie.join(' , ')}
          </RoomFeature>
          <RoomFeature>
            <p>체크인 / 체크아웃</p>
            {time}
          </RoomFeature>
        </DetailEx>

        <Price>
          <p>1박요금</p>
          <div>{price}</div>
        </Price>
      </InfoContainer>
    </RoomContainer>
  );
};

export default RoomType;
