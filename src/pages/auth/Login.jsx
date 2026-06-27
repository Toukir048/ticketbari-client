import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaGoogle, FaTicketAlt } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { loginUser, googleLoginUser, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!formData.email) {
      Swal.fire("Missing Email", "Please enter your email.", "warning");
      return;
    }

    try {
      const nameFromEmail = formData.email.split("@")[0];

      await loginUser({
        email: formData.email,
        name: nameFromEmail,
        password: formData.password,
        photoURL: "",
      });

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back to TicketBari!",
        timer: 1400,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire(
        "Login Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLoginUser();
    } catch (error) {
      Swal.fire(
        "Google Login Failed",
        error.message || "Something went wrong.",
        "error"
      );
    }
  };

  return (
    <section className="auth-page">
      <motion.div
        className="floating-ticket ticket-one"
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <FaTicketAlt />
      </motion.div>

      <motion.div
        className="floating-ticket ticket-two"
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <FaTicketAlt />
      </motion.div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="auth-badge">TicketBari Access</div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to book tickets, manage requests, and explore your dashboard.
        </p>

        <form onSubmit={handleLogin} className="auth-form">
          <label>
            Email Address
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <motion.button
            type="submit"
            className="auth-submit-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="auth-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <FaGoogle />
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        <p className="auth-switch">
          New to TicketBari? <Link to="/register">Create an account</Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Login;