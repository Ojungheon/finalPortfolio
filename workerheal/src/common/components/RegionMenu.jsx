import React, { useState } from 'react';
import styled from 'styled-components';

// 스타일 정의
const RegionMenu = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const Region = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? '#8041FF' : 'white')};
  color: ${(props) => (props.selected ? 'white' : 'black')};

  &:hover {
    background-color: #f0f0f0;
  }
`;

const regions = [
  ['서울', '경기'],
  ['인천', '부산'],
  ['광주', '대구'],
  ['대전', '울산'],
  ['제주', '강원'],
  ['경남', '경북'],
  ['전남', '전북'],
];

const RegionSelector = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleSelect = (region) => {
    setSelectedRegion(region);
  };

  return (
    <RegionMenu>
      {regions.flat().map((region, index) => (
        <Region
          key={index}
          selected={selectedRegion === region}
          onClick={() => handleSelect(region)}
        >
          {region}
        </Region>
      ))}
    </RegionMenu>
  );
};

export default RegionSelector;
