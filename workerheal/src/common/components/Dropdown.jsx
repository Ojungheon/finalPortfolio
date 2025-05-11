// src/common/components/Dropdown.jsx
import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  width: ${({ width }) => width || "275px"};
`;

const DropdownButton = styled.div`
  padding: 12px;
  width: 267x;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #FFA500;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border-radius: 3px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 12px 15px;
  font-size: 1em;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  &:hover {
    color: white;
    background: #9257ff;
  }
`;

const Dropdown = ({ options, selected, onSelect, width, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContainer width={width}>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {selected || placeholder || "선택하세요"}
      </DropdownButton>
      {isOpen && (
        <DropdownMenu>
          {options.map((option) => (
            <DropdownItem
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option === "" ? "전체" : option}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default Dropdown;
