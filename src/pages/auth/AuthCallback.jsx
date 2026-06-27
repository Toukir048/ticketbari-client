import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const AuthCallback = () => {
  const { syncBetterAuthUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const completeGoogleLogin = async () => {
      try {
        await syncBetterAuthUser();

        Swal.fire({
          icon: "success",
          title: "Google Login Successful",
          text: "Welcome to TicketBari!",
          timer: 1400,
          showConfirmButton: false,
        });

        navigate("/dashboard", { replace: true });
      } catch (error) {
        Swal.fire(
          "Google Login Failed",
          error.response?.data?.message || "Could not sync Better Auth session.",
          "error"
        );

        navigate("/login", { replace: true });
      }
    };

    completeGoogleLogin();
  }, [syncBetterAuthUser, navigate]);

  return <LoadingSpinner message="Completing Google login..." />;
};

export default AuthCallback;