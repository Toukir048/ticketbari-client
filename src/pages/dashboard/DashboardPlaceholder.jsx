import { motion } from "framer-motion";

const DashboardPlaceholder = ({ title, description }) => {
  return (
    <motion.section
      className="dashboard-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="placeholder-glow"></div>

      <h1>{title}</h1>
      <p className="muted-text">{description}</p>

      <div className="coming-card">
        <h2>Coming in next commits</h2>
        <p>
          This page route is ready. API data, tables, forms, and actions will be
          connected step by step.
        </p>
      </div>
    </motion.section>
  );
};

export default DashboardPlaceholder;