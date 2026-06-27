import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Checking login session..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;