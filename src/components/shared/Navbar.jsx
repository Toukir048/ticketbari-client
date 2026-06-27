import { NavLink } from "react-router-dom";

const Navbar = () => {
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

          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/login" className={navLinkClass}>
            Login
          </NavLink>

          <NavLink to="/register" className={navLinkClass}>
            Register
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;