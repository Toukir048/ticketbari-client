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
import AddTicket from "../pages/dashboard/vendor/AddTicket";
import VendorMyTickets from "../pages/dashboard/vendor/VendorMyTickets";
import RequestedBookings from "../pages/dashboard/vendor/RequestedBookings";
import VendorRevenue from "../pages/dashboard/vendor/VendorRevenue";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageTickets from "../pages/dashboard/admin/ManageTickets";
import AdvertiseTickets from "../pages/dashboard/admin/AdvertiseTickets";


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
                                <AddTicket />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "my-tickets",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <VendorMyTickets />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "requested-bookings",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <RequestedBookings />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "revenue",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <VendorRevenue />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "manage-users",
                        element: (
                            <RoleRoute allowedRoles={["admin"]}>
                                <ManageUsers />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "manage-tickets",
                        element: (
                            <RoleRoute allowedRoles={["admin"]}>
                                <ManageTickets />
                            </RoleRoute>
                        ),
                    },
                    {
                        path: "advertise-tickets",
                        element: (
                            <RoleRoute allowedRoles={["admin"]}>
                                <AdvertiseTickets />
                            </RoleRoute>
                        ),
                    },
                ],
            },
        ],
    },
]);

export default router;