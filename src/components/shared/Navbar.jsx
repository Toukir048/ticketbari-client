import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, role, logoutUser } = useAuth();

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-link" : "nav-link";

  return (
    <header className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="logo">
          TicketBari
        </NavLink>

        <nav className="nav-menu">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/all-tickets" className={navLinkClass}>
            All Tickets
          </NavLink>

          {user && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard {role ? `(${role})` : ""}
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>

              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <button type="button" className="logout-btn" onClick={logoutUser}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;