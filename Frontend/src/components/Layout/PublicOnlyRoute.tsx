// components/Layout/PublicOnlyRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';

type PublicOnlyRouteProps = {
  user: any;
  children: JSX.Element;
  redirectPath?: string;
};

const PublicOnlyRoute = ({ user, children, redirectPath = "/dashboard" }: PublicOnlyRouteProps) => {
  const location = useLocation();

  if (user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default PublicOnlyRoute;