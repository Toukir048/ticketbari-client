import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import AllTickets from "../pages/tickets/AllTickets";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DashboardHome from "../pages/dashboard/DashboardHome";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "all-tickets",
        element: <AllTickets />,
      },
      {
        path: "dashboard",
        element: <DashboardHome />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

export default router;