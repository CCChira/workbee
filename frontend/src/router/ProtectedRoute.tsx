import { ReactNode } from 'react';
import { useUserStore } from '@/store/user.ts';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const userStore = useUserStore();

  if (!userStore.user.loggedIn) {
    return <Navigate to={'/login'} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
