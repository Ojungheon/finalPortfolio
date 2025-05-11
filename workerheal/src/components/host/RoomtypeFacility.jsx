import React, { useState } from 'react';
import styled from 'styled-components';

const FacilityContainer = styled.div``;

const FacilityList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  font-size: 18px;
  font-weight: bold;
`;

const RoomtypeFacility = ({ updateField }) => {
  const [selectedFacilities, setSelectedFacilities] = useState([]);

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
    updateField('facilitieCode', updatedFacilities.join(','));
  };

  const facilityOptions = [
    { code: '002', label: '무료 와이파이' },
    { code: '008', label: '스타일러' },
    { code: '011', label: '흡연' },
    { code: '015', label: '룸서비스' },
    { code: '016', label: '캐비넷' },
    { code: '021', label: '마사지 의자' },
  ];

  return (
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
  );
};

export default RoomtypeFacility;
