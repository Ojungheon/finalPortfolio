import React from 'react';
import { InputLabel, Input, FormControl, TextField } from '@mui/material';

const MuiInput = ({
  id,
  name,
  label,
  type,
  variant,
  color,
  isFocused,
  isError,
  helper,
  sx,
}) => {
  return (
    <FormControl>
      <TextField
        id={id}
        name={name}
        label={label}
        required={true}
        disabled={type == 'disabled'}
        variant={variant}
        color={color}
        focused={isFocused}
        error={isError}
        helperText={helper != null && helper.length > 0 ? helper : null}
        sx={sx}
      />
      {/* <InputLabel sx={labelSx}>{labelName}</InputLabel>
      <Input
        name={name}
        label={labelName}
        required={true}
        disabled={type == 'disabled'}
        variant={variant}
        color={color}
        focused={isFocused}
        error={isError}
        helperText={helper != null && helper.length > 0 ? helper : null}
        sx={InputSx}
      /> */}
    </FormControl>
  );
};

export default MuiInput;
