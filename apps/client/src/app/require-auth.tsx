import { Navigate, Outlet } from 'react-router';
import { readStoredAuth } from '../util/read-stored-auth';
import { AppRoutes } from '../routes';

export function RequireAuth() {
  if (!readStoredAuth()) {
    return <Navigate to={AppRoutes.LOGIN} replace />;
  }

  return <Outlet />;
}
