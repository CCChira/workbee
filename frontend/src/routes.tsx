import React from 'react';
import Test from "./Test.tsx";
import LoginPage from "./components/pages/LoginPage/LoginPage.tsx";
// import { Navigate } from 'react-router-dom';
// import HomePage from '../pages/HomePage';
// import AboutPage from '../pages/AboutPage';
// import NotFoundPage from '../pages/NotFoundPage';

interface RouteType {
  path: string;
  element: React.ReactNode;
}

const routes: RouteType[] = [
  { path: '/', element: <Test /> },
  { path: '/login', element: <LoginPage /> },
  // { path: '/404', element: <NotFoundPage /> },
  // { path: '*', element: <Navigate to="/404" replace /> },
];

export default routes;
