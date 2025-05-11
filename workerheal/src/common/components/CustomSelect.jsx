import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { styled } from 'styled-components';
import React from 'react';

const Selectarea = styled.div`
  width: 100%;
  height: 100%;
`;

const CustomSelect = ({ className, value, onChange, options }) => {
  return (
    <Selectarea className={className}>
      <select value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Selectarea>
  );
};

export default CustomSelect;
