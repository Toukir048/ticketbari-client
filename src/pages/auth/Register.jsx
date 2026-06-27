import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaGoogle, FaTicketAlt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const { registerUser, googleLoginUser, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email) {
      Swal.fire(
        "Missing Information",
        "Please enter your name and email.",
        "warning"
      );
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        photoURL: formData.photoURL,
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Welcome to TicketBari!",
        timer: 1400,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire(
        "Registration Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };

 const handleGoogleRegister = async () => {
  try {
    await googleLoginUser();
  } catch (error) {
    Swal.fire(
      "Google Registration Failed",
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
        className="auth-card register-card"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="auth-badge">Join TicketBari</div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Register to book tickets, track bookings, and access your dashboard.
        </p>

        <form onSubmit={handleRegister} className="auth-form">
          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

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
            Photo URL
            <input
              type="url"
              name="photoURL"
              placeholder="https://example.com/photo.jpg"
              value={formData.photoURL}
              onChange={handleChange}
            />
          </label>

          <motion.button
            type="submit"
            className="auth-submit-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
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
          onClick={handleGoogleRegister}
          disabled={loading}
        >
          <FaGoogle />
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Register;