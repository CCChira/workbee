import './App.css';
import RouterComponent from './components/router/RouterComponent.tsx';
import {
  AppBar,
  Box,
  CssBaseline,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { theme } from './theme.ts';
import Logo from './components/Logo.tsx';

function App() {
  const { pathname } = useLocation();

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {pathname !== '/login' && (
          <AppBar color="primary" position="sticky">
            <Box
              sx={{
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Logo sx={{ width: '50px', height: '50px' }} />
                <Typography sx={{ fontSize: '32px', fontWeight: 'bold' }}>
                  WorkBee
                </Typography>
              </Box>
            </Box>
          </AppBar>
        )}
        <button>fsvfds</button>
        <RouterComponent />
      </ThemeProvider>
    </>
  );
}

export default App;
