import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

export default function Scope({ scope }) {
  return (
    <Box sx={{ '& > legend': { mt: 2 } }}>
      <Typography component="legend"></Typography>
      <Rating name="read-only" value={scope} readOnly />
    </Box>
  );
}
