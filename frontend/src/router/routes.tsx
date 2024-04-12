import { RouteObject } from 'react-router-dom';
import App from '@/App.tsx';
import { ReactNode } from 'react';
import { HomeIcon } from 'lucide-react';
import Login from '@/components/pages/Login.tsx';
import ProtectedRoute from '@/router/ProtectedRoute.tsx';
interface CustomRouteObject {
  path: string;
  element: ReactNode;
  icon?: ReactNode;
}
const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    icon: <HomeIcon />,
  },
  {
    path: '/login',
    element: <Login />,
  },
];
export const paths = routes.map((route) => route.path);
export default routes;
