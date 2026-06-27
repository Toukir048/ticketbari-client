import { motion } from "framer-motion";
import { FaShieldAlt, FaTicketAlt, FaUserCheck } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const DashboardHome = () => {
  const { user, role } = useAuth();

  const cards = [
    {
      title: "Secure Access",
      text: "JWT protected session with role based dashboard control.",
      icon: <FaShieldAlt />,
    },
    {
      title: "Ticket Workflow",
      text: "Booking, approval, payment, and dashboard routes are ready.",
      icon: <FaTicketAlt />,
    },
    {
      title: "Current Role",
      text: `You are logged in as ${role || "user"}.`,
      icon: <FaUserCheck />,
    },
  ];

  return (
    <motion.section
      className="dashboard-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="dashboard-hero">
        <div>
          <span className="dashboard-kicker">TicketBari Dashboard</span>
          <h1>Welcome, {user?.name || "User"}</h1>
          <p>
            Your dashboard is protected. You will see features based on your
            current role.
          </p>
        </div>

        <div className="dashboard-role-orb">{role || "user"}</div>
      </div>

      <div className="dashboard-stat-grid">
        {cards.map((card) => (
          <motion.div
            className="dashboard-stat-card"
            key={card.title}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220 }}
          >
            <div className="stat-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default DashboardHome;