import App from '@/App.tsx';
import { ReactNode } from 'react';
import {
  CalendarIcon,
  ContactRound,
  DoorOpenIcon,
  HardHatIcon,
  HomeIcon,
  MapPin,
  MessageSquareTextIcon,
  PackageOpenIcon,
} from 'lucide-react';
import Login from '@/components/pages/Login.tsx';
import ProtectedRoute from '@/router/ProtectedRoute.tsx';
import Clients from '@/components/pages/Clients.tsx';
import ClientDetails from '@/components/pages/ClientDetails.tsx';
import Locations from '@/components/pages/Locations.tsx';
import LocationDetails from '@/components/pages/LocationDetails.tsx';
import ContractDetails from '@/components/pages/ContractDetails.tsx';
import Tasks from '@/components/pages/Tasks/Tasks.tsx';
import TasksDetails from '@/components/pages/Tasks/TasksDetails.tsx';
import { Roles } from '@/utils/types.ts';
import Employees from '@/components/pages/Employees.tsx';
import EmployeeDetails from '@/components/pages/EmployeeDetails.tsx';
import Calendar from '@/components/pages/Calendar.tsx';
import Messages from '@/components/pages/Messages.tsx';
import RoomDetails from '@/components/pages/RoomDetails.tsx';
import Rooms from '@/components/pages/Rooms';

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
      <ProtectedRoute roles={[Roles.ADMIN]}>
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
      <ProtectedRoute roles={[Roles.ADMIN]}>
        <Clients />
      </ProtectedRoute>
    ),
    icon: <ContactRound />,
  },
  {
    path: 'employees',
    alias: 'Employees',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN]}>
        <Employees />
      </ProtectedRoute>
    ),
    icon: <HardHatIcon />,
  },
  {
    path: 'employees/:employeeId',
    alias: 'Employees Tasks',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN]}>
        <EmployeeDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:clientId',
    alias: 'All Clients',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN]}>
        <ClientDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/locations',
    alias: 'Locations',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN, Roles.CLIENT]}>
        <Locations />
      </ProtectedRoute>
    ),
    icon: <MapPin />,
  },
  {
    path: '/locations/:locationId',
    alias: 'Locations',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN, Roles.CLIENT]}>
        <LocationDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/locations/:locationId/:roomId',
    alias: 'Rooms',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN, Roles.CLIENT]}>
        <RoomDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/contracts/:contractId',
    alias: 'Contracts',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN, Roles.CLIENT]}>
        <ContractDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:userId/:contractId/',
    alias: 'Clients',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN]}>
        <ContractDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tasks/calendar',
    alias: 'Task Scheduling',
    element: <Calendar />,
    icon: <CalendarIcon />,
  },
  {
    path: '/tasks',
    alias: 'Tasks Overview',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN, Roles.CLIENT]}>
        <Tasks />
      </ProtectedRoute>
    ),
    icon: <PackageOpenIcon />,
  },
  {
    path: '/tasks/:clientId',
    alias: 'Tasks Overview',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN, Roles.CLIENT]}>
        <Tasks />
      </ProtectedRoute>
    ),
  },
  {
    path: 'tasks/:clientId/:contractId',
    alias: 'Tasks Contract Details',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN, Roles.CLIENT]}>
        <TasksDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: 'messages',
    alias: 'Messages',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN, Roles.CLIENT]}>
        <Messages />
      </ProtectedRoute>
    ),
  },
  {
    path: 'rooms',
    alias: 'Rooms',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN, Roles.CLIENT]}>
        <Rooms />
      </ProtectedRoute>
    ),
    icon: <DoorOpenIcon />,
  },
  {
    path: 'rooms/:roomId',
    alias: 'Rooms',
    element: (
      <ProtectedRoute roles={[Roles.ADMIN, Roles.CLIENT]}>
        <RoomDetails />
      </ProtectedRoute>
    ),
  },
];
export const paths = routes.map((route) => route.path);
export default routes;
