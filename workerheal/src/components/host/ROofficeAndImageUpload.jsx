import React from 'react';
import styled from 'styled-components';

const AccomWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
`;

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormLabel = styled.label`
  font-weight: bold;
  font-size: 15px;
  white-space: nowrap;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  font-size: 16px;
  text-align: center;
`;

const PostalCodeContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const SearchButton = styled.button`
  margin-left: 10px;
  height: 40px;
  padding: 0 15px;
  cursor: not-allowed;
`;

const CustomSelectWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;

  select {
    font-size: 18px;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    text-align: center;
    box-sizing: border-box;
  }
`;

const CapacityWrapper = styled.div`
  flex: 1;
  width: 30%;
`;

const ImageWrapper = styled.div`
  padding-top: 20px;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  grid-column: 1 / -1;
  font-weight: bold;
  font-size: 15px;
`;

const UploadLabel = styled.label`
  font-weight: bold;
  font-size: 15px;
`;

const UploadButton = styled.button`
  border: none;
  color: #8041ff;
  background: none;
  font-weight: bold;
  cursor: not-allowed;
`;

const ImageUploadContainer = styled.div`
  grid-column: span 4;
  display: flex;
  gap: 10px;
  border-radius: 10px;
  padding: 10px;
`;

const ImageBox = styled.div`
  width: 120px;
  height: 120px;
  border: 2px solid #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  position: relative;
`;

const ImageInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: not-allowed;
`;

const ROofficeAndImageUpload = ({ detailData }) => {
  const { officeInfo, officeAttachmentInfo } = detailData;

  const repImage = officeAttachmentInfo?.find((image) => image.orderNo === 1);
  const additionalImages = officeAttachmentInfo?.filter(
    (image) => image.orderNo !== 1
  );

  return (
    <>
      {/* 오피스 정보 입력 영역 */}
      <AccomWrapper>
        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel>오피스명</FormLabel>
          <Input type="text" value={officeInfo?.name} readOnly />
        </FieldContainer>
        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel>사업장 등록번호</FormLabel>
          <Input type="text" value={officeInfo?.businessNo} readOnly />
        </FieldContainer>
        <FieldContainer>
          <FormLabel>지역</FormLabel>
          <CustomSelectWrapper>
            <Input type="text" value={officeInfo?.regionName} readOnly />
          </CustomSelectWrapper>
        </FieldContainer>
        <FieldContainer>
          <FormLabel>가격</FormLabel>
          <Input type="text" value={officeInfo?.price} readOnly />
        </FieldContainer>
        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel>연락처</FormLabel>
          <Input type="text" value={officeInfo?.phone} readOnly />
        </FieldContainer>
        <FieldContainer>
          <FormLabel>수용 인원</FormLabel>
          <CapacityWrapper>
            <Input type="number" value={officeInfo?.capacity} readOnly />
          </CapacityWrapper>
        </FieldContainer>
        <FieldContainer>
          <FormLabel>오픈 시간</FormLabel>
          <Input type="time" value={officeInfo?.open} readOnly />
        </FieldContainer>
        <FieldContainer>
          <FormLabel>마감 시간</FormLabel>
          <Input type="time" value={officeInfo?.close} readOnly />
        </FieldContainer>
        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel>우편번호</FormLabel>
          <PostalCodeContainer>
            <Input type="text" value={officeInfo?.postCode} readOnly />
          </PostalCodeContainer>
        </FieldContainer>
        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel>상세 주소</FormLabel>
          <Input type="text" value={officeInfo?.detailAddress} readOnly />
        </FieldContainer>
        <FieldContainer style={{ gridColumn: 'span 4' }}>
          <FormLabel>도로명 주소</FormLabel>
          <Input type="text" value={officeInfo?.roadAddress} readOnly />
        </FieldContainer>
      </AccomWrapper>

      {/* 이미지 업로드 영역 */}
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

        <Title>
          <UploadLabel>추가이미지 선택</UploadLabel>
          <UploadButton>추가</UploadButton>
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

export default ROofficeAndImageUpload;
