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

const RoomtypeAndImageUpload = ({
  formData,
  updateField,
  additionalImages,
  setAdditionalImages,
  repImage,
  setRepImage,
}) => {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   price: '',
  //   sleeps: '',
  //   sleepsMax: '',
  //   amount: '',
  //   checkIn: '',
  //   checkOut: '',
  // });
  const handleRepImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setRepImage({ file, preview });
    }
  };

  const handleRemoveRepImage = () => {
    setRepImage({ file: null, preview: null });
  };

  const handleAddAdditionalImage = () => {
    setAdditionalImages([...additionalImages, { file: null, preview: null }]);
  };

  // 이미지 추가 핸들러
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setAdditionalImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = { file, preview };
        return newImages;
      });
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = (index) => {
    setAdditionalImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <>
      {/* 객실 정보 입력 영역 */}
      <RoomWrapper>
        <FieldContainer>
          <FormLabel htmlFor="name">객실명</FormLabel>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => {
              updateField('name', e.target.value);
            }}
            inputWidth="250px"
          />
        </FieldContainer>

        <FieldContainer>
          <FormLabel htmlFor="price">가격</FormLabel>
          <Input
            type="text"
            name="price"
            value={formData.price}
            onChange={(e) => {
              updateField('price', e.target.value);
            }}
            inputWidth="100px"
          />
        </FieldContainer>
      </RoomWrapper>
      <RoomWrapper2>
        <FieldContainer2>
          <FormLabel htmlFor="sleeps">기준 수용 인원</FormLabel>
          <Input
            type="text"
            name="sleeps"
            value={formData.sleeps}
            onChange={(e) => {
              updateField('sleeps', e.target.value);
            }}
            inputWidth="80px"
          />
        </FieldContainer2>

        <FieldContainer2>
          <FormLabel htmlFor="singleBed">싱글 베드</FormLabel>
          <Input
            type="text"
            name="singleBed"
            value={formData.singleBed}
            onChange={(e) => {
              updateField('singleBed', e.target.value);
            }}
            inputWidth="80px"
          />
        </FieldContainer2>

        <FieldContainer2>
          <FormLabel htmlFor="doubleBed">더블 베드</FormLabel>
          <Input
            type="text"
            name="doubleBed"
            value={formData.doubleBed}
            onChange={(e) => {
              updateField('doubleBed', e.target.value);
            }}
            inputWidth="80px"
          />
        </FieldContainer2>
      </RoomWrapper2>
      <RoomWrapper2>
        <FieldContainer>
          <FormLabel htmlFor="amount">수량</FormLabel>
          <Input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={(e) => {
              updateField('amount', e.target.value);
            }}
            inputWidth="80px"
          />
        </FieldContainer>

        <FieldContainer>
          <FormLabel htmlFor="checkIn">입실</FormLabel>
          <Input
            type="time"
            name="checkIn"
            value={formData.checkIn}
            onChange={(e) => {
              updateField('checkIn', e.target.value);
            }}
          />
        </FieldContainer>

        <FieldContainer>
          <FormLabel htmlFor="checkOut">퇴실</FormLabel>
          <Input
            type="time"
            name="checkOut"
            value={formData.checkOut}
            onChange={(e) => {
              updateField('checkOut', e.target.value);
            }}
          />
        </FieldContainer>
      </RoomWrapper2>

      {/* 대표 이미지 업로드 영역 */}
      <ImageWrapper>
        <Title>
          <UploadLabel>대표이미지 선택</UploadLabel>
        </Title>
        <ImageUploadContainer>
          <ImageBox>
            {repImage.preview ? (
              <>
                <img src={repImage.preview} alt="대표이미지" />
                <RemoveButton onClick={handleRemoveRepImage}>×</RemoveButton>
              </>
            ) : (
              '사진 추가'
            )}
            <ImageInput type="file" onChange={handleRepImageChange} />
          </ImageBox>
        </ImageUploadContainer>

        {/* 추가 이미지 업로드 영역 */}
        <Title>
          <UploadLabel>추가이미지 선택</UploadLabel>
          <UploadButton onClick={handleAddAdditionalImage}>추가</UploadButton>
        </Title>
        <ImageUploadContainer>
          {additionalImages.map((img, index) => (
            <ImageBox key={index}>
              {img.preview ? (
                <>
                  <img src={img.preview} alt={`추가이미지 ${index + 1}`} />
                  <RemoveButton onClick={() => handleRemoveImage(index)}>
                    x
                  </RemoveButton>
                </>
              ) : (
                '사진 추가'
              )}
              <ImageInput
                type="file"
                onChange={(e) => handleImageChange(e, index)}
              />
            </ImageBox>
          ))}
        </ImageUploadContainer>
      </ImageWrapper>
    </>
  );
};

export default RoomtypeAndImageUpload;
