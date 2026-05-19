import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '../../store/useAuthStore';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to="/login"
        state={{ from: location.pathname + location.search + location.hash }}
      />
    );
  }

  return <Outlet />;
}
