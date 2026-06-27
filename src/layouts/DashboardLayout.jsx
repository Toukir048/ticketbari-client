import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaHome,
  FaPlusCircle,
  FaTicketAlt,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user, role } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive ? "dashboard-link active-dashboard-link" : "dashboard-link";

  return (
    <section className="dashboard-shell">
      <motion.aside
        className="dashboard-sidebar"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="dashboard-user-card">
          <div className="dashboard-avatar">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} />
            ) : (
              <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
            )}
          </div>

          <h3>{user?.name || "TicketBari User"}</h3>
          <p>{user?.email}</p>
          <span className="role-pill">{role || "user"}</span>
        </div>

        <nav className="dashboard-menu">
          <NavLink to="/dashboard" end className={linkClass}>
            <FaHome />
            Dashboard Home
          </NavLink>

          <NavLink to="/dashboard/profile" className={linkClass}>
            <FaUsers />
            My Profile
          </NavLink>

          {role === "user" && (
            <>
              <NavLink to="/dashboard/my-bookings" className={linkClass}>
                <FaTicketAlt />
                My Bookings
              </NavLink>

              <NavLink to="/dashboard/transactions" className={linkClass}>
                <FaWallet />
                Transactions
              </NavLink>
            </>
          )}

          {role === "vendor" && (
            <>
              <NavLink to="/dashboard/add-ticket" className={linkClass}>
                <FaPlusCircle />
                Add Ticket
              </NavLink>

              <NavLink to="/dashboard/my-tickets" className={linkClass}>
                <FaTicketAlt />
                My Tickets
              </NavLink>

              <NavLink to="/dashboard/requested-bookings" className={linkClass}>
                <FaUsers />
                Requested Bookings
              </NavLink>

              <NavLink to="/dashboard/revenue" className={linkClass}>
                <FaChartLine />
                Revenue
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <>
              <NavLink to="/dashboard/manage-users" className={linkClass}>
                <FaUsers />
                Manage Users
              </NavLink>

              <NavLink to="/dashboard/manage-tickets" className={linkClass}>
                <FaTicketAlt />
                Manage Tickets
              </NavLink>

              <NavLink to="/dashboard/advertise-tickets" className={linkClass}>
                <FaChartLine />
                Advertise Tickets
              </NavLink>
            </>
          )}
        </nav>
      </motion.aside>

      <motion.div
        className="dashboard-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Outlet />
      </motion.div>
    </section>
  );
};

export default DashboardLayout;