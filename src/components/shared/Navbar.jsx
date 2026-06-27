import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaBars,
  FaChevronDown,
  FaMoon,
  FaSignOutAlt,
  FaSun,
  FaTachometerAlt,
  FaTicketAlt,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const Navbar = () => {
  const { user, role, logoutUser, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    closeAll();
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "tb-nav-link tb-nav-link-active" : "tb-nav-link";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="tb-main-nav">
      <div className="tb-nav-shell">
        <Link to="/" className="tb-nav-brand" onClick={closeAll}>
          <span>
            <FaTicketAlt />
          </span>
          TicketBari
        </Link>

        <button
          type="button"
          className="tb-nav-mobile-btn"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`tb-nav-panel ${isMenuOpen ? "tb-nav-panel-open" : ""}`}>
          <nav className="tb-nav-links">
            <NavLink to="/" className={navLinkClass} onClick={closeAll}>
              Home
            </NavLink>

            <NavLink to="/all-tickets" className={navLinkClass} onClick={closeAll}>
              All Tickets
            </NavLink>

            {user && (
              <NavLink to="/dashboard" className={navLinkClass} onClick={closeAll}>
                Dashboard
              </NavLink>
            )}
          </nav>

          <div className="tb-nav-actions">
            <button type="button" className="tb-nav-theme-btn" onClick={toggleTheme}>
              {theme === "dark" ? <FaSun /> : <FaMoon />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            {!loading && !user && (
              <div className="tb-nav-auth">
                <Link to="/login" className="tb-nav-login" onClick={closeAll}>
                  Login
                </Link>

                <Link to="/register" className="tb-nav-register" onClick={closeAll}>
                  Register
                </Link>
              </div>
            )}

            {!loading && user && (
              <div className="tb-nav-user-wrap" ref={userMenuRef}>
                <button
                  type="button"
                  className="tb-nav-user-btn"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.name || "User"} />
                  ) : (
                    <span className="tb-nav-user-fallback">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}

                  <div>
                    <strong>{user?.name || "TicketBari User"}</strong>
                    <small>{role || "user"}</small>
                  </div>

                  <FaChevronDown />
                </button>

                {isUserMenuOpen && (
                  <div className="tb-nav-user-menu">
                    <div className="tb-nav-user-head">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.name || "User"} />
                      ) : (
                        <span className="tb-nav-user-fallback">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}

                      <div>
                        <h4>{user?.name || "TicketBari User"}</h4>
                        <p>{user?.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/dashboard/profile"
                      className="tb-nav-user-item"
                      onClick={closeAll}
                    >
                      <FaUserCircle />
                      My Profile
                    </Link>

                    <Link
                      to="/dashboard"
                      className="tb-nav-user-item"
                      onClick={closeAll}
                    >
                      <FaTachometerAlt />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      className="tb-nav-user-item tb-nav-user-logout"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;