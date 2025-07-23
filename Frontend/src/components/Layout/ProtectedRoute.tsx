// components/Layout/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  user: any;
  children: JSX.Element;
  redirectPath?: string;
};

const ProtectedRoute = ({ user, children, redirectPath = "/login" }: ProtectedRouteProps) => {
  const location = useLocation();
  
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;