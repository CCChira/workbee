import App from '@/App.tsx';
import { ReactNode } from 'react';
import { HomeIcon, ContactRound } from 'lucide-react';
import Login from '@/components/pages/Login.tsx';
import ProtectedRoute from '@/router/ProtectedRoute.tsx';
import Clients from '@/components/pages/Clients.tsx';
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
  {
    path: '/clients',
    element: (
      <ProtectedRoute>
        <Clients />
      </ProtectedRoute>
    ),
    icon: <ContactRound />,
  },
];
export const paths = routes.map((route) => route.path);
export default routes;
