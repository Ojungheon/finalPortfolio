import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

// Styled Components
const DropdownContainer = styled.div`
  position: relative;
  width: 120px;
  height: 30px;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 10px;
  border: 2px solid #a084e8;
  background: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  padding-left: 15px;
  height: 100%;
`;

const DropdownText = styled.span`
  flex: 1;
  text-align: left;
`;

const DropdownIcon = styled.span`
  margin-left: auto;
  padding-right: 8px;
  font-size: 14px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 250%;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  border-radius: 10px;
  overflow: hidden;
  font-weight: bold;
  transform: translateX(-30%);
`;

const GridTable = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
`;

const Cell = styled.div`
  padding: 10px;
  text-align: center;
  cursor: pointer;
  background: ${(props) => (props.selected ? '#8041FF' : 'white')};
  color: ${(props) => (props.selected ? 'white' : 'black')};
  border: 1px solid #ddd;

  &:hover {
    background: #ddd;
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

const RegionDropdown = () => {
  const [selectedRegion, setSelectedRegion] = useState('지역');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 선택된 지역 설정 및 드롭다운 닫기
  const handleSelect = (region) => {
    setSelectedRegion(region);
    setIsOpen(false);
  };

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        <DropdownText>{selectedRegion}</DropdownText>
        <DropdownIcon>▼</DropdownIcon>
      </DropdownButton>
      <DropdownMenu isOpen={isOpen}>
        <GridTable>
          {regions.flat().map((region, index) => (
            <Cell
              key={index}
              selected={selectedRegion === region}
              onClick={() => handleSelect(region)}
            >
              {region}
            </Cell>
          ))}
        </GridTable>
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default RegionDropdown;
