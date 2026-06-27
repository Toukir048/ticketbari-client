import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaLock, FaShieldAlt } from "react-icons/fa";

const Unauthorized = () => {
  const location = useLocation();

  return (
    <section className="unauthorized-page">
      <motion.div
        className="unauthorized-card"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <div className="unauthorized-icon">
          <FaLock />
        </div>

        <span>Access Restricted</span>

        <h1>You are not allowed to open this page.</h1>

        <p>
          This route is protected by role based access control. Your current
          account role does not match the permission required for this page.
        </p>

        {location.state?.requiredRoles && (
          <div className="required-role-box">
            <FaShieldAlt />
            <strong>Required Role:</strong>
            <span>{location.state.requiredRoles.join(", ")}</span>
          </div>
        )}

        <div className="unauthorized-actions">
          <Link to="/dashboard" className="unauthorized-primary-btn">
            Go to Dashboard
          </Link>

          <Link to="/" className="unauthorized-secondary-btn">
            <FaArrowLeft />
            Back Home
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Unauthorized;