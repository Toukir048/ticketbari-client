import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTicketAlt } from "react-icons/fa";

import MetaTags from "../components/shared/MetaTags";

const NotFound = () => {
  return (
    <>
      <MetaTags
        title="Page Not Found"
        description="The TicketBari page you are trying to open is not available."
        noIndex
      />
      <section className="not-found-page">
        <motion.div
          className="not-found-card"
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          <div className="not-found-icon">
            <FaTicketAlt />
          </div>

          <span>404 Route Missing</span>

          <h1>This ticket counter does not exist.</h1>

          <p>
            The page you are trying to open may be moved, deleted, or the route
            is not available.
          </p>

          <Link to="/" className="not-found-btn">
            <FaArrowLeft />
            Back to Home
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default NotFound;
