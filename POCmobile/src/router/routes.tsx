import App from './../App.tsx';
import { ReactNode } from 'react';
import {Cog, HomeIcon, MessagesSquareIcon} from "lucide-react";
import Login from "../pages/Login.tsx";
import Tasks from "../pages/Tasks.tsx";
import TaskDetails from "../pages/TaskDetails.tsx";
import Messages from "../pages/Messages.tsx";


interface CustomRouteObject {
  path: string;
  alias: string;
  element: ReactNode;
  icon?: ReactNode;
}
const routes: CustomRouteObject[] = [
  {
    path: '/',
    alias: 'Login',
    element: (
      <Login />
    ),
  },
  {
    path: '/tasks',
    alias: 'Tasks',
    element: (
        <Tasks />
    ),
    icon: <HomeIcon className='text-primary'/>
  },
  {
    path: '/tasks/task-details',
    alias: 'Tasks',
    element: (
      <TaskDetails />
    ),
  },
  {
    path: '/messages',
    alias: 'Messages',
    element: (
      <Messages/>
    ),
    icon: <MessagesSquareIcon className='text-primary'/>
  },
  {
    path: '/utils',
    alias: 'Settings',
    element: (
      <App/>
    ),
    icon: <Cog className='text-primary'/>
  },

];
export const paths = routes.map((route) => route.path);
export default routes;
