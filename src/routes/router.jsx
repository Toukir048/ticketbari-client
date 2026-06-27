import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/home/Home";
import AllTickets from "../pages/tickets/AllTickets";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DashboardHome from "../pages/dashboard/DashboardHome";
import Profile from "../pages/dashboard/Profile";
import DashboardPlaceholder from "../pages/dashboard/DashboardPlaceholder";
import NotFound from "../pages/NotFound";

import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import TicketDetails from "../pages/tickets/TicketDetails";
import MyBookings from "../pages/dashboard/user/MyBookings";
import Transactions from "../pages/dashboard/user/Transactions";
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
                path: "tickets/:id",
                element: (
                    <PrivateRoute>
                        <TicketDetails />
                    </PrivateRoute>
                ),
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "dashboard",
                element: (
                    <PrivateRoute>
                        <DashboardLayout />
                    </PrivateRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <DashboardHome />,
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                    },
                    {
                        path: "my-bookings",
                        element: (
                            <RoleRoute allowedRoles={["user"]}>
                                <MyBookings />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "transactions",
                        element: (
                            <RoleRoute allowedRoles={["user"]}>
                                <Transactions />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "add-ticket",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <DashboardPlaceholder
                                    title="Add Ticket"
                                    description="Vendor ticket creation form will be added here."
                                />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "my-tickets",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <DashboardPlaceholder
                                    title="My Tickets"
                                    description="Vendor added ticket list, update, and delete actions will be added here."
                                />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "requested-bookings",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <DashboardPlaceholder
                                    title="Requested Bookings"
                                    description="Vendor accepted and rejected booking request actions will be added here."
                                />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "revenue",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <DashboardPlaceholder
                                    title="Revenue Overview"
                                    description="Vendor revenue chart and transaction summary will be added here."
                                />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "manage-users",
                        element: (
                            <RoleRoute allowedRoles={["admin"]}>
                                <DashboardPlaceholder
                                    title="Manage Users"
                                    description="Admin user role management and fraud vendor marking will be added here."
                                />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "manage-tickets",
                        element: (
                            <RoleRoute allowedRoles={["admin"]}>
                                <DashboardPlaceholder
                                    title="Manage Tickets"
                                    description="Admin ticket approval and rejection table will be added here."
                                />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "advertise-tickets",
                        element: (
                            <RoleRoute allowedRoles={["admin"]}>
                                <DashboardPlaceholder
                                    title="Advertise Tickets"
                                    description="Admin advertised ticket control with maximum 6 selected tickets will be added here."
                                />
                            </RoleRoute>
                        ),
                    },
                ],
            },
        ],
    },
]);

export default router;