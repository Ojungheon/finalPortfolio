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
  cursor: pointer;
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
  }
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
  cursor: pointer;
`;

const ImageUploadContainer = styled.div`
  grid-column: span 4;
  display: flex;
  gap: 10px;
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
  cursor: pointer;
`;

const ReadOnlyAccommodationAndImageUpload = ({ detailData }) => {
  console.log('detailData', detailData);

  const { lodgingInfo, lodgingAttachmentInfo } = detailData;
  console.log(lodgingAttachmentInfo[0]?.name);

  // 대표이미지 추가이미지 구분
  const repImage = lodgingAttachmentInfo?.find((image) => image.orderNo === 1);

  // `orderNo`가 1이 아닌 이미지를 모두 가져오는 배열
  const additionalImages = lodgingAttachmentInfo?.filter(
    (image) => image.orderNo !== 1
  );

  return (
    <>
      {/* 숙소 정보 입력 영역 */}
      <AccomWrapper>
        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel>숙소명</FormLabel>
          <Input type="text" value={lodgingInfo?.name} readOnly />
        </FieldContainer>
        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel>사업장 등록번호</FormLabel>
          <Input type="text" value={lodgingInfo?.businessNo} readOnly />
        </FieldContainer>
        <FieldContainer>
          <FormLabel>지역</FormLabel>
          <CustomSelectWrapper>
            <Input type="text" value={lodgingInfo?.regionName} readOnly />
          </CustomSelectWrapper>
        </FieldContainer>
        <FieldContainer>
          <FormLabel>유형</FormLabel>
          <CustomSelectWrapper>
            <Input type="text" value={lodgingInfo?.typeName} readOnly />
          </CustomSelectWrapper>
        </FieldContainer>
        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel>연락처</FormLabel>
          <Input type="text" value={lodgingInfo?.phone} readOnly />
        </FieldContainer>
        <FieldContainer style={{ gridColumn: 'span 1' }}>
          <FormLabel>우편번호</FormLabel>
          <PostalCodeContainer>
            <Input type="text" value={lodgingInfo?.postCode} readOnly />
          </PostalCodeContainer>
        </FieldContainer>
        <FieldContainer style={{ gridColumn: 'span 3' }}>
          <FormLabel>도로명 주소</FormLabel>
          <Input type="text" value={lodgingInfo?.roadAddress} readOnly />
        </FieldContainer>
        <FieldContainer style={{ gridColumn: 'span 4' }}>
          <FormLabel>상세 주소</FormLabel>
          <Input type="text" value={lodgingInfo?.detailAddress} readOnly />
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

export default ReadOnlyAccommodationAndImageUpload;
