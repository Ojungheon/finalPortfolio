import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RegionDropdown from '../../common/components/RegionDropdown';
import CustomSelect from '../../common/components/CustomSelect';

// 공통 Wrapper: 그리드 레이아웃 (4열)
const AccomWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
`;

/* ============================
   숙소 정보 입력 부분 (AccommodationForm)
   ============================ */
const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 15px;
  white-space: nowrap;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  font-size: 16px;
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
  white-space: nowrap;
`;

const CustomSelectWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* align-items: center; */

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

const ImageWrapper = styled.div`
  padding-top: 20px;
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
  grid-column: span 4; /* 이미지 업로드 영역은 전체 열 사용 */
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

// X 버튼 스타일
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
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 1;
`;

const ImageInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

/* ============================
   합쳐진 컴포넌트
   ============================ */
const AccommodationAndImageUpload = ({
  formData,
  updateField,
  additionalImages,
  setAdditionalImages,
  repImage,
  setRepImage,
}) => {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   businessNo: '',
  //   regionNo: '',
  //   typeNo: '',
  //   phone: '',
  //   postCode: '',
  //   roadAddress: '',
  //   detailAddress: '',
  // });

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const [selectedValue, setSelectedValue] = useState('');
  const handleChanges = (event) => {
    setSelectedValue(event.target.value);
  };

  const areaOptions = [
    { value: '1', label: '서울' },
    { value: '3', label: '경기' },
    { value: '2', label: '인천' },
    { value: '11', label: '부산' },
    { value: '16', label: '광주' },
    { value: '9', label: '대구' },
    { value: '14', label: '대전' },
    { value: '12', label: '울산' },
    { value: '17', label: '제주' },
    { value: '4', label: '강원' },
    { value: '13', label: '경남' },
    { value: '10', label: '경북' },
    { value: '8', label: '전남' },
    { value: '7', label: '전북' },
  ];

  const typeOptions = [
    { value: '1', label: '호텔' },
    { value: '2', label: '모텔' },
    { value: '3', label: '리조트' },
    { value: '4', label: '펜션' },
  ];

  // Daum 우편번호
  useEffect(() => {
    if (!document.getElementById('daum-postcode-script')) {
      const script = document.createElement('script');
      script.id = 'daum-postcode-script';
      script.src =
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // 우편번호 검색 버튼 클릭 시 Daum 우편번호 API 호출
  const handlePostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          updateField('postCode', data.zonecode);
          updateField('roadAddress', data.roadAddress);
        },
      }).open();
    }
  };

  // 드롭다운 메뉴 별도 관리
  const [regionSelected, setRegionSelected] = useState('');
  const [typeSelected, setTypeSelected] = useState('');

  const handleRegionChange = (e) => {
    const value = e.target.value;
    setRegionSelected(value);
    updateField('regionNo', value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setTypeSelected(value);
    updateField('typeNo', value);
  };

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
      {/* 숙소 정보 입력 영역 */}
      <AccomWrapper>
        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel htmlFor="name">숙소명</FormLabel>
          <Input
            type="text"
            name="name"
            placeholder="숙소명"
            value={formData.name}
            onChange={(e) => {
              updateField('name', e.target.value);
            }}
          />
        </FieldContainer>

        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel htmlFor="businessNo">사업장 등록번호</FormLabel>
          <Input
            type="text"
            name="businessNo"
            placeholder="사업장 등록번호"
            value={formData.businessNo}
            onChange={(e) => {
              updateField('businessNo', e.target.value);
            }}
          />
        </FieldContainer>

        <FieldContainer>
          <FormLabel htmlFor="regionNo">지역</FormLabel>
          <CustomSelectWrapper>
            <select value={regionSelected} onChange={handleRegionChange}>
              <option value="">선택</option>
              {areaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </CustomSelectWrapper>
        </FieldContainer>

        <FieldContainer>
          <FormLabel htmlFor="typeNo">유형</FormLabel>
          <CustomSelectWrapper>
            <select value={typeSelected} onChange={handleTypeChange}>
              <option value="">선택</option>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </CustomSelectWrapper>
        </FieldContainer>

        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel htmlFor="phone">연락처</FormLabel>
          <Input
            type="text"
            name="phone"
            placeholder="연락처"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
        </FieldContainer>

        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel htmlFor="postCode">우편번호</FormLabel>
          <PostalCodeContainer>
            <Input
              type="text"
              name="postCode"
              placeholder="우편번호"
              value={formData.postCode}
              readOnly
            />
            <SearchButton type="button" onClick={handlePostcode}>
              우편번호 검색
            </SearchButton>
          </PostalCodeContainer>
        </FieldContainer>

        <FieldContainer style={{ gridColumn: 'span 2' }}>
          <FormLabel htmlFor="roadAddress">도로명 주소</FormLabel>
          <Input
            type="text"
            name="roadAddress"
            placeholder="도로명 주소"
            value={formData.roadAddress}
            readOnly
          />
        </FieldContainer>

        <FieldContainer style={{ gridColumn: 'span 4' }}>
          <FormLabel htmlFor="detailAddress">상세 주소</FormLabel>
          <Input
            type="text"
            name="detailAddress"
            placeholder="상세 주소"
            value={formData.detailAddress}
            onChange={(e) => {
              updateField('detailAddress', e.target.value);
            }}
          />
        </FieldContainer>
      </AccomWrapper>

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

export default AccommodationAndImageUpload;
