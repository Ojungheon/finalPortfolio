import React, { useState } from 'react';
import styled from 'styled-components';

// 공통 Wrapper (2열)
const RoomWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 10px;
`;

// 공통 Wrapper (3열)
const RoomWrapper2 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
`;

// 객실 정보 입력 부분
const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
`;

const FieldContainer2 = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 15px;
  white-space: nowrap;
`;

const Input = styled.input`
  height: 40px;
  border: 1px solid #ccc;
  font-size: 16px;

  /* props로부터 전달받은 inputWidth가 있으면 사용, 없으면 기본값 100% */
  width: ${(props) => props.inputWidth || '100%'};

  &::placeholder {
    text-align: right;
  }
`;

const ImageWrapper = styled.div`
  padding-top: 20px;
  margin-top: 20px;
`;

/* ============================
   이미지 업로드 부분 (ImageUpload)
   ============================ */
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  grid-column: 1 / -1; /* 제목은 전체 열 사용 */
`;

const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 15px;
`;

const UploadButton = styled.button`
  border: none;
  color: #8041ff;
  background: none;
  font-weight: bold;
  cursor: pointer;
`;

const ImageUploadContainer = styled.div`
  border: none;
  grid-column: span 4;
  display: flex;
  flex-direction: row;
  gap: 10px;
  border-radius: 10px;
  padding: 10px;
`;

const ImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 2px solid #ccc;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  color: #666;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// x 버튼 스타일
const RemoveButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
`;

const ImageInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const ROrtAndImageUpload = ({ detailData }) => {
  const { roomTypeInfo, roomTypeAttachmentInfo } = detailData;

  const repImage = roomTypeAttachmentInfo?.find((image) => image.orderNo === 1);
  const additionalImages = roomTypeAttachmentInfo?.filter(
    (image) => image.orderNo !== 1
  );

  return (
    <>
      {/* 객실 정보 입력 영역 */}
      <RoomWrapper>
        <FieldContainer>
          <FormLabel htmlFor="name">객실명</FormLabel>
          <Input type="text" value={roomTypeInfo?.name} readOnly />
        </FieldContainer>

        <FieldContainer>
          <FormLabel htmlFor="price">가격</FormLabel>
          <Input type="text" value={roomTypeInfo?.price} readOnly />
        </FieldContainer>
      </RoomWrapper>
      <RoomWrapper2>
        <FieldContainer2>
          <FormLabel htmlFor="sleeps">기준 수용 인원</FormLabel>
          <Input type="text" value={roomTypeInfo?.sleeps} readOnly />
        </FieldContainer2>

        <FieldContainer2>
          <FormLabel htmlFor="singleBed">싱글 베드</FormLabel>
          <Input type="text" value={roomTypeInfo?.singleBed} readOnly />
        </FieldContainer2>

        <FieldContainer2>
          <FormLabel htmlFor="doubleBed">더블 베드</FormLabel>
          <Input type="text" value={roomTypeInfo?.doubleBed} readOnly />
        </FieldContainer2>
      </RoomWrapper2>
      <RoomWrapper2>
        <FieldContainer>
          <FormLabel htmlFor="amount">수량</FormLabel>
          <Input
            type="text"
            value={roomTypeInfo?.amount}
            readOnly
            inputWidth="80px"
          />
        </FieldContainer>

        <FieldContainer>
          <FormLabel htmlFor="checkIn">입실</FormLabel>
          <Input type="text" value={roomTypeInfo?.checkIn} readOnly />
        </FieldContainer>

        <FieldContainer>
          <FormLabel htmlFor="checkOut">퇴실</FormLabel>
          <Input type="text" value={roomTypeInfo?.checkOut} readOnly />
        </FieldContainer>
      </RoomWrapper2>

      {/* 대표 이미지 업로드 영역 */}
      <ImageWrapper>
        <Title>
          <UploadLabel>대표이미지 선택</UploadLabel>
        </Title>
        <ImageUploadContainer>
          <ImageBox>
            {repImage ? (
              <img
                src={repImage.path}
                alt="대표 이미지"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              '사진 추가'
            )}
            <ImageInput type="file" disabled />
          </ImageBox>
        </ImageUploadContainer>

        {/* 추가 이미지 업로드 영역 */}
        <Title>
          <UploadLabel>추가이미지 선택</UploadLabel>
        </Title>
        <ImageUploadContainer>
          {additionalImages?.map((image, index) => (
            <ImageBox key={index}>
              <img
                src={image.path} // Use image.path for additional images
                alt={`추가 이미지 ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <ImageInput type="file" disabled />
            </ImageBox>
          ))}
        </ImageUploadContainer>
      </ImageWrapper>
    </>
  );
};

export default ROrtAndImageUpload;
