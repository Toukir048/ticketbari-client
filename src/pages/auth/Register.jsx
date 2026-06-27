import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaGoogle, FaTicketAlt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const { registerUser, loading } = useAuth();
  const navigate = useNavigate();

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
      Swal.fire("Missing Info", "Name and email are required.", "warning");
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
        text: "Your TicketBari account is ready!",
        timer: 1400,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (error) {
      Swal.fire(
        "Registration Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };

  const handleGoogleRegister = () => {
    Swal.fire(
      "Coming Next",
      "Google registration functionality will be connected in the next auth commit.",
      "info"
    );
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
          Register once and start booking transport tickets with a modern
          dashboard experience.
        </p>

        <form onSubmit={handleRegister} className="auth-form">
          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="Your full name"
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
            {loading ? "Creating Account..." : "Create Account"}
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
        >
          <FaGoogle />
          Continue with Google
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login now</Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Register;