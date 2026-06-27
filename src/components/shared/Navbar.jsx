import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBars, FaMoon, FaSun, FaTicketAlt, FaTimes } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const Navbar = () => {
  const { user, role, logoutUser, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-nav-link" : "nav-link";

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    closeMobileMenu();
  };

  return (
    <header className={`navbar ${isMenuOpen ? "mobile-menu-open" : ""}`}>
      <div className="navbar-top">
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <span>
            <FaTicketAlt />
          </span>
          TicketBari
        </Link>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="navbar-collapse">
        <nav className="nav-menu">
          <NavLink to="/" className={navLinkClass} onClick={closeMobileMenu}>
            Home
          </NavLink>

          <NavLink
            to="/all-tickets"
            className={navLinkClass}
            onClick={closeMobileMenu}
          >
            All Tickets
          </NavLink>

          {user && (
            <NavLink
              to="/dashboard"
              className={navLinkClass}
              onClick={closeMobileMenu}
            >
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
              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="register-nav-btn"
                onClick={closeMobileMenu}
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;