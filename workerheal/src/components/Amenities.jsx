import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// 어메니티 매핑 객체
const AMENITIES_MAP = {
  1: '커피포트',
  2: '공용 와이파이',
  3: '수하물 보관',
  4: '주차 가능',
  5: 'TV',
  6: '에어컨',
  7: '난방',
  8: '헤어드라이어',
  9: '세탁기',
};

// 제목 스타일
const TitleLayout = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 30px;
`;

// 제목 텍스트
const Title = styled.div`
  font-size: 17px;
  font-weight: bold;
  margin: 5px;
  margin-right: 20px;
`;

// 타이틀 아래 라인
const LineDiv = styled.div`
  width: 85px;
  height: 5px;
  background-color: #8041ff;
`;

// 어메니티 목록 스타일
const AmenitiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 10px;
`;

// 개별 어메니티 항목 스타일
const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #333;
  padding: 10px 20px;
  border-radius: 8px;
`;

const CheckIcon = styled(FontAwesomeIcon)`
  margin-right: 8px;
  color: #626262;
`;

const Amenities = ({ selectedAmenities }) => {
  return (
    <>
      <TitleLayout>
        <Title>편의시설</Title>
        <LineDiv />
      </TitleLayout>
      <AmenitiesContainer>
        {selectedAmenities != null
          ? selectedAmenities.map((amenityId) => (
              <AmenityItem key={amenityId}>
                <CheckIcon icon={faCheck} />
                {/* {AMENITIES_MAP[amenityId]} 태훈 수정*/}
                {amenityId}
              </AmenityItem>
            ))
          : '로딩중'}
      </AmenitiesContainer>
    </>
  );
};

export default Amenities;
