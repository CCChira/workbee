import { ReactNode } from 'react';
import { useUserStore } from '@/store/user.ts';
import { Navigate } from 'react-router-dom';
import { Roles } from '@/utils/types.ts';

interface ProtectedRouteProps {
  children: ReactNode;
  roles: Roles[];
}

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const userStore = useUserStore();
  console.log(userStore.user.loggedIn && roles.includes(userStore.user.role));
  if (!userStore.user.loggedIn && !roles.includes(userStore.user.role)) {
    console.log('here');
    return <Navigate to={'/login'} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
