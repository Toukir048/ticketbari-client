import { NavLink, Link } from "react-router-dom";
import { FaMoon, FaSun, FaTicketAlt } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const Navbar = () => {
  const { user, role, logoutUser, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-nav-link" : "nav-link";

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand-logo">
        <span>
          <FaTicketAlt />
        </span>
        TicketBari
      </Link>

      <nav className="nav-menu">
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>

        <NavLink to="/all-tickets" className={navLinkClass}>
          All Tickets
        </NavLink>

        {user && (
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
        )}
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle dark light theme"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>

        {user ? (
          <div className="nav-user-box">
            <div className="nav-user-meta">
              <strong>{user.name || "User"}</strong>
              <span>{role || "user"}</span>
            </div>

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
              disabled={loading}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-nav-links">
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>

            <NavLink to="/register" className="register-nav-btn">
              Register
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;