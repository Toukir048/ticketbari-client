import { useEffect, useState } from "react";
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

const getInitials = (name = "") => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
};

const isValidImageUrl = (url) => {
  return (
    typeof url === "string" &&
    url.trim() !== "" &&
    url !== "undefined" &&
    url !== "null" &&
    (url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:image"))
  );
};

const DashboardLayout = () => {
  const { user, dbUser, role } = useAuth();
  const [imageError, setImageError] = useState(false);

  const profileName = user?.name || dbUser?.name || "TicketBari User";
  const profileEmail = user?.email || dbUser?.email || "";
  const profileRole = role || dbUser?.role || "user";
  const profilePhoto =
    user?.photoURL || user?.image || dbUser?.photoURL || dbUser?.image || "";

  const shouldShowImage = isValidImageUrl(profilePhoto) && !imageError;

  const linkClass = ({ isActive }) =>
    isActive ? "dashboard-link active-dashboard-link" : "dashboard-link";

  useEffect(() => {
    setImageError(false);
  }, [profilePhoto]);

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
            {shouldShowImage ? (
              <img
                src={profilePhoto}
                alt={profileName}
                onError={() => setImageError(true)}
              />
            ) : (
              <span>{getInitials(profileName)}</span>
            )}
          </div>

          <h3>{profileName}</h3>
          <p>{profileEmail}</p>
          <span className="role-pill">{profileRole}</span>
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

          {profileRole === "user" && (
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

          {profileRole === "vendor" && (
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

          {profileRole === "admin" && (
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