import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking role permission..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          from: location,
          requiredRoles: allowedRoles,
        }}
        replace
      />
    );
  }

  return children;
};

export default RoleRoute;