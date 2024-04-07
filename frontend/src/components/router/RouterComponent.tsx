import { Route, Routes, useLocation } from 'react-router-dom';
import routes from '../../routes';
import { Box, styled, useTheme } from '@mui/material';

const RouterComponent = () => {
  const { pathname } = useLocation();
  const theme = useTheme();
  const Page = styled(Box)({
    height: `calc(100%${pathname === '/login' ? '' : ' - 72px'})`,
    backgroundColor: theme.palette.background.paper,
  });
  return (
    <Page>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Page>
  );
};

export default RouterComponent;
