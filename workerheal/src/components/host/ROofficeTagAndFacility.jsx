import React from 'react';
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
  cursor: not-allowed;
`;

const FacilityList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  font-size: 18px;
  font-weight: bold;
`;

const FacilityContainer = styled.div`
  margin-top: 20px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
`;

const CustomCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  border: 2px solid #2ecc71;
  display: flex;
  align-items: center;
  justify-content: center;
  appearance: none;

  &:checked {
    background-color: #2ecc71;
    border: 2px solid #2ecc71;
  }

  &:checked::before {
    content: '✔';
    color: white;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
`;

const ROofficeTagAndFacility = ({ detailData }) => {
  const { officeInfo } = detailData;
  const tags = officeInfo?.tag ? officeInfo.tag.split(',') : [];
  const selectedFacilities = officeInfo?.facilitieCode || [];

  const facilityOptions = [
    { code: '001', label: '전용 주차장' },
    { code: '002', label: '무료 와이파이' },
    { code: '003', label: '헬프데스크' },
    { code: '004', label: '24시간 편의점' },
    { code: '005', label: '회의실' },
    { code: '009', label: '전산팀' },
    { code: '011', label: '흡연' },
    { code: '012', label: 'ATM 기계' },
    { code: '013', label: '자판기' },
    { code: '016', label: '캐비넷' },
    { code: '017', label: '발렛 파킹' },
    { code: '019', label: '레스트룸' },
    { code: '021', label: '마사지 의자' },
    { code: '023', label: '택시 예약 서비스' },
    { code: '024', label: '프린터' },
    { code: '026', label: '수유실' },
    { code: '027', label: '빔프로젝터' },
  ];

  return (
    <Wrapper>
      <TagContainer>
        <h2>해시태그 설정</h2>
        <TagInputContainer>
          <TagInput type="text" placeholder="최대 10자" disabled />
          <Button disabled>추가</Button>
        </TagInputContainer>
        <TagsWrapper>
          {tags.length > 0 ? (
            tags.map((tag, index) => <Tag key={index}>#{tag}</Tag>)
          ) : (
            <span style={{ color: '#aaa' }}>등록된 태그가 없습니다.</span>
          )}
        </TagsWrapper>
      </TagContainer>

      <FacilityContainer>
        <h2>시설/서비스</h2>
        <FacilityList>
          {facilityOptions.map((facility, index) => (
            <CheckboxLabel key={index}>
              <CustomCheckbox
                disabled
                checked={selectedFacilities.includes(facility.code)}
              />{' '}
              {facility.label}
            </CheckboxLabel>
          ))}
        </FacilityList>
      </FacilityContainer>
    </Wrapper>
  );
};

export default ROofficeTagAndFacility;
