import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
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

  const baseNavLinkClass =
    "inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-blue-600/10 hover:text-blue-600 dark:!text-slate-100 dark:hover:!bg-sky-400/10 dark:hover:!text-sky-300";

  const navLinkClass = ({ isActive }) =>
    isActive
      ? `${baseNavLinkClass} bg-blue-600/10 text-blue-600 dark:!bg-sky-400/10 dark:!text-sky-300`
      : baseNavLinkClass;

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
    <header className="sticky top-2 z-[999999] mx-auto my-3 w-[min(1180px,calc(100%-20px))] sm:top-3 sm:my-4 sm:w-[min(1180px,calc(100%-32px))]">
      <div className="flex min-h-[76px] flex-wrap items-center gap-4 rounded-[26px] border border-slate-200 bg-white/95 p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95 dark:shadow-[0_26px_72px_rgba(2,6,23,0.34)] lg:flex-nowrap">
        <Link
          to="/"
          className="inline-flex items-center gap-3 whitespace-nowrap text-2xl font-black text-slate-950 no-underline dark:!text-slate-50"
          onClick={closeAll}
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
            <FaTicketAlt />
          </span>
          TicketBari
        </Link>

        <Button
          type="button"
          isIconOnly
          className="ml-auto grid size-11 min-w-11 place-items-center rounded-2xl bg-slate-900 !text-white dark:bg-slate-800 [&_*]:!text-inherit lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </Button>

        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } w-full flex-col items-stretch gap-3 pt-3 lg:flex lg:w-auto lg:flex-1 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:pt-0`}
        >
          <nav className="flex flex-col items-stretch gap-2 lg:flex-1 lg:flex-row lg:items-center lg:justify-center">
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

          <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:gap-2">
            <Button
              type="button"
              variant="bordered"
              className="min-h-10 rounded-full border-slate-200 bg-white px-4 font-black text-slate-950 dark:!border-slate-700 dark:!bg-slate-800 dark:!text-slate-50 [&_*]:!text-inherit"
              onPress={toggleTheme}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </Button>

            {!loading && !user && (
              <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
                <Link
                  to="/login"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 no-underline transition hover:border-blue-200 hover:text-blue-600 dark:!border-slate-700 dark:!bg-slate-800 dark:!text-slate-50"
                  onClick={closeAll}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 px-4 text-sm font-black text-white no-underline shadow-[0_14px_30px_rgba(37,99,235,0.2)] transition hover:-translate-y-0.5"
                  onClick={closeAll}
                >
                  Register
                </Link>
              </div>
            )}

            {!loading && user && (
              <div className="relative z-[1000000] w-full lg:w-auto" ref={userMenuRef}>
                <Button
                  type="button"
                  variant="bordered"
                  className="min-h-11 w-full justify-between rounded-full border-slate-200 bg-white px-2 py-1.5 text-slate-950 dark:!border-slate-700 dark:!bg-slate-800 dark:!text-slate-50 [&>svg]:!text-inherit lg:w-auto lg:justify-start"
                  onPress={() => setIsUserMenuOpen((prev) => !prev)}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name || "User"}
                      className="size-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 font-black text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}

                  <div className="grid min-w-0 text-left leading-tight">
                    <strong className="max-w-32 truncate text-sm font-black text-slate-950 dark:!text-slate-50">
                      {user?.name || "TicketBari User"}
                    </strong>
                    <small className="text-xs font-black capitalize !text-blue-600 dark:!text-sky-300">
                      {role || "user"}
                    </small>
                  </div>

                  <FaChevronDown />
                </Button>

                {isUserMenuOpen && (
                  <div className="mt-3 w-full rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_55px_rgba(15,23,42,0.1)] dark:!border-slate-700 dark:!bg-slate-900 lg:absolute lg:right-0 lg:top-full lg:mt-3 lg:w-72">
                    <div className="mb-2 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:!bg-slate-800">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name || "User"}
                          className="size-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 font-black text-white">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}

                      <div className="min-w-0">
                        <h4 className="m-0 text-sm font-black text-slate-950 dark:!text-slate-50">
                          {user?.name || "TicketBari User"}
                        </h4>
                        <p className="mt-1 break-all text-xs font-bold text-slate-500 dark:!text-slate-300">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/dashboard/profile"
                      className="flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-black text-slate-700 no-underline transition hover:bg-blue-600/10 hover:text-blue-600 dark:!text-slate-100 dark:hover:!text-sky-300"
                      onClick={closeAll}
                    >
                      <FaUserCircle />
                      My Profile
                    </Link>

                    <Link
                      to="/dashboard"
                      className="flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-black text-slate-700 no-underline transition hover:bg-blue-600/10 hover:text-blue-600 dark:!text-slate-100 dark:hover:!text-sky-300"
                      onClick={closeAll}
                    >
                      <FaTachometerAlt />
                      Dashboard
                    </Link>

                    <Button
                      type="button"
                      variant="light"
                      className="min-h-11 w-full justify-start rounded-2xl px-3 py-2.5 text-sm font-black !text-red-600 [&_*]:!text-inherit"
                      onPress={handleLogout}
                    >
                      <FaSignOutAlt />
                      Logout
                    </Button>
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
