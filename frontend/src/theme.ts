import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFB602',
    },
    secondary: {
      main: '#0D0D0D',
      light: '#5e5e5e',
    },
    background: {
      paper: '#0D0D0D',
      default: '#0D0D0D',
    },
    grey: {
      50: '#eeeeef',
    },
  },
});
