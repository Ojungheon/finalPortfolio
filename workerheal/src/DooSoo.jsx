import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import theme from './common/styles/theme';
// import DateSelector from './common/components/DateSelector';

import AdminPage from './pages/admin/AdminPage';

const DooSoo = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <AdminPage />
      </ThemeProvider>
    </div>
  );
};

export default DooSoo;
