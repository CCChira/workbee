import App from '@/App.tsx';
import { ReactNode } from 'react';
import { HomeIcon, ContactRound, MapPin, PackageOpenIcon } from 'lucide-react';
import Login from '@/components/pages/Login.tsx';
import ProtectedRoute from '@/router/ProtectedRoute.tsx';
import Clients from '@/components/pages/Clients.tsx';
import ClientDetails from '@/components/pages/ClientDetails.tsx';
import Locations from '@/components/pages/Locations.tsx';
import LocationDetails from '@/components/pages/LocationDetails.tsx';
import ContractDetails from '@/components/pages/ContractDetails.tsx';
import Tasks from '@/components/pages/Tasks.tsx';
import TasksDetails from '@/components/pages/TasksDetails.tsx';
interface CustomRouteObject {
  path: string;
  alias: string;
  element: ReactNode;
  icon?: ReactNode;
}
const routes: CustomRouteObject[] = [
  {
    path: '/',
    alias: 'Home',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    icon: <HomeIcon />,
  },
  {
    path: '/login',
    alias: 'Login',
    element: <Login />,
  },
  {
    path: '/clients',
    alias: 'All Clients',
    element: (
      <ProtectedRoute>
        <Clients />
      </ProtectedRoute>
    ),
    icon: <ContactRound />,
  },
  {
    path: '/clients/:clientId',
    alias: 'All Clients',
    element: (
      <ProtectedRoute>
        <ClientDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/locations',
    alias: 'Locations',
    element: (
      <ProtectedRoute>
        <Locations />
      </ProtectedRoute>
    ),
    icon: <MapPin />,
  },
  {
    path: '/locations/:locationId',
    alias: 'Locations',
    element: (
      <ProtectedRoute>
        <LocationDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/contracts/:contractId',
    alias: 'Contracts',
    element: (
      <ProtectedRoute>
        <ContractDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:userId/:contractId/',
    alias: 'Clients',
    element: (
      <ProtectedRoute>
        <ContractDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tasks/:clientId',
    alias: 'Tasks Overview',
    element: (
      <ProtectedRoute>
        <Tasks />
      </ProtectedRoute>
    ),
    icon: <PackageOpenIcon />,
  },
  {
    path: 'contracts/tasks/:clientId/:contractId',
    alias: 'Tasks Contract Details',
    element: (
      <ProtectedRoute>
        <TasksDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
  },
];
export const paths = routes.map((route) => route.path);
export default routes;
