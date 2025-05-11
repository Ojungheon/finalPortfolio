import React from 'react';
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';

const MuiSelect = ({
  menuList,
  labelName,
  name,
  size,
  color,
  value,
  handler,
  labelSx,
  SelectSx,
}) => {
  return (
    <FormControl size={size ? size : null} color={color ? color : null}>
      {menuList.length > 0 ? (
        <>
          <InputLabel sx={labelSx}>{labelName}</InputLabel>
          <Select
            sx={
              color
                ? {
                    ...SelectSx,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: `var(--${color}-main)`,
                    },
                    '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: `var(--${color}-dark)`,
                      },
                  }
                : SelectSx
            }
            name={name}
            label={labelName}
            // defaultValue={value}
            value={value}
            onChange={handler}
            MenuProps={
              color
                ? {
                    PaperProps: {
                      sx: {
                        '& .MuiMenuItem-root.Mui-selected': {
                          bgcolor: `var(--${color}-light)`,
                          color: 'white',
                        },
                        '& .MuiMenuItem-root:hover': {
                          bgcolor: `var(--${color}-main)`,
                          color: 'white',
                        },
                        '& .MuiMenuItem-root.Mui-selected:hover': {
                          bgcolor: `var(--${color}-main)`,
                          color: 'white',
                        },
                      },
                    },
                  }
                : ''
            }
          >
            {menuList.map((data) => (
              <MenuItem
                key={Object.entries(data)[0][1]}
                value={Object.entries(data)[0][1]}
              >
                {Object.entries(data)[1][1]}
              </MenuItem>
            ))}
          </Select>
        </>
      ) : (
        <p>옵션을 불러오는 중</p>
      )}
    </FormControl>
  );
};

export default MuiSelect;
