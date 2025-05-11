import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // mode: 'light',
    primary: {
      main: '#FFAA0C',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8041FF',
    },
    success: {
      main: '#36af3d',
      contrastText: '#fff',
    },
    cancel: {
      main: '#aeb7af',
      contrastText: '#fff',
    },
  },
});

export default theme;
