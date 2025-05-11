import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 0.3fr 0.7fr;
  height: 100vh;
`;

const TagContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TagInputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const TagInput = styled.input`
  padding: 8px;
  background-color: #ededed;
  border: none;
  width: 430px;
  height: 30px;
  border-radius: 5px;
  font-size: 20px;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const FacilityList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  font-size: 18px;
  font-weight: bold;
`;

const FacilityContainer = styled.div``;

const TagAndFacility = ({ formData, updateField }) => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const addTag = () => {
    if (tagInput && tags.length < 10) {
      const newTags = [...tags, tagInput];
      setTags([...tags, tagInput]);
      setTagInput('');
      updateField('tag', newTags.join(','));
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    updateField('tag', newTags.join(','));
  };

  // 시설 체크박스 처리
  const handleFacilityChange = (facilityCode) => {
    let updatedFacilities;
    if (selectedFacilities.includes(facilityCode)) {
      updatedFacilities = selectedFacilities.filter(
        (code) => code !== facilityCode
      );
    } else {
      updatedFacilities = [...selectedFacilities, facilityCode];
    }
    setSelectedFacilities(updatedFacilities);
    // 부모 상태 업데이트: 선택된 시설들을 콤마로 구분하여 전달
    updateField('facilitieCode', updatedFacilities.join(','));
  };

  const Tag = styled.span`
    display: flex;
    align-items: center;
    background-color: #ffaa0c;
    font-size: 20px;
    font-weight: bold;
    color: white;
    padding: 5px;
    border-radius: 5px;
    height: 36px;
  `;

  const Button = styled.button`
    background: none;
    border: none;
    color: #8041ff;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
  `;

  const facilityOptions = [
    { code: '001', label: '전용 주차장' },
    { code: '002', label: '무료 와이파이' },
    { code: '003', label: '헬프데스크' },
    { code: '004', label: '24시간 편의점' },
    { code: '006', label: '가이드북' },
    { code: '007', label: '수영장' },
    { code: '010', label: '픽업 서비스' },
    { code: '011', label: '흡연' },
    { code: '012', label: 'ATM 기계' },
    { code: '013', label: '자판기' },
    { code: '014', label: '로비 스낵바' },
    { code: '015', label: '룸서비스' },
    { code: '016', label: '캐비넷' },
    { code: '017', label: '발렛 파킹' },
    { code: '018', label: '셔틀버스' },
    { code: '022', label: '동전 세탁기' },
    { code: '023', label: '택시 예약 서비스' },
  ];

  return (
    <Wrapper>
      <TagContainer>
        <h2>해시태그 설정</h2>
        <TagInputContainer>
          <TagInput
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="최대 10자"
          />
          <Button onClick={addTag}>추가</Button>
        </TagInputContainer>
        <TagsWrapper>
          {tags.map((tag, index) => (
            <Tag key={index}>
              #{tag}
              <Button onClick={() => removeTag(tag)}>Ｘ</Button>
            </Tag>
          ))}
        </TagsWrapper>
      </TagContainer>

      <FacilityContainer>
        <h2>시설/서비스</h2>
        <FacilityList>
          {facilityOptions.map((facility, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={selectedFacilities.includes(facility.code)}
                onChange={() => handleFacilityChange(facility.code)}
              />{' '}
              {facility.label}
            </label>
          ))}
        </FacilityList>
      </FacilityContainer>
    </Wrapper>
  );
};

export default TagAndFacility;
