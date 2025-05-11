import React from 'react';
import { FormControl, TextField } from '@mui/material';

const MuiTextField = ({
  id,
  name,
  label,
  type,
  variant,
  color,
  value,
  isFocused,
  isError,
  helper,
  handler,
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
        onChange={handler}
        value={value ? value : null}
        helperText={helper != null && helper.length > 0 ? helper : null}
        sx={sx}
      />
    </FormControl>
  );
};

export default MuiTextField;
