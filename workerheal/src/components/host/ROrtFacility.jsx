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

const ROrtFacility = ({ detailData }) => {
  const { roomTypeInfo } = detailData;
  console.log('roomTypeInfo : ', roomTypeInfo);

  const tags = roomTypeInfo?.tag ? roomTypeInfo.tag.split(',') : [];
  const selectedFacilities = roomTypeInfo?.facilitieCode || [];
  console.log('selectedFacilities : ', selectedFacilities);

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
  );
};

export default ROrtFacility;
