import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/home/Home";
import AllTickets from "../pages/tickets/AllTickets";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DashboardHome from "../pages/dashboard/DashboardHome";
import Profile from "../pages/dashboard/Profile";
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
import PublicRoute from "./PublicRoute";
import Unauthorized from "../pages/Unauthorized";
import AuthCallback from "../pages/auth/AuthCallback";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFound />,
        handle: {
            meta: {
                title: "Smart ticket booking",
                description:
                    "Book transport tickets, track bookings, and manage TicketBari workflows from one place.",
            },
        },
        children: [
            {
                index: true,
                element: <Home />,
                handle: {
                    meta: {
                        title: "Home",
                        description:
                            "Find and request bus, train, launch, and plane tickets with TicketBari.",
                    },
                },
            },
            {
                path: "all-tickets",
                element: <AllTickets />,
                handle: {
                    meta: {
                        title: "All Tickets",
                        description:
                            "Browse available routes, transport options, dates, and ticket prices on TicketBari.",
                    },
                },
            },
            {
                path: "tickets/:id",
                element: (
                    <PrivateRoute>
                        <TicketDetails />
                    </PrivateRoute>
                ),
                handle: {
                    meta: {
                        title: "Ticket Details",
                        description:
                            "Review route details, availability, pricing, and booking options for this ticket.",
                    },
                },
            },
            {
                path: "login",
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                ),
                handle: {
                    meta: {
                        title: "Login",
                        description:
                            "Log in to your TicketBari account to manage bookings and tickets.",
                    },
                },
            },

            {
                path: "register",
                element: (
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                ),
                handle: {
                    meta: {
                        title: "Register",
                        description:
                            "Create a TicketBari account to request tickets and access your dashboard.",
                    },
                },
            },
            {
                path: "auth/callback",
                element: <AuthCallback />,
                handle: {
                    meta: {
                        title: "Signing In",
                        description:
                            "Completing secure TicketBari authentication.",
                        noIndex: true,
                    },
                },
            },
            {
                path: "unauthorized",
                element: (
                    <PrivateRoute>
                        <Unauthorized />
                    </PrivateRoute>
                ),
                handle: {
                    meta: {
                        title: "Unauthorized",
                        description:
                            "This TicketBari page is not available for your current account permissions.",
                        noIndex: true,
                    },
                },
            },
            {
                path: "dashboard",
                element: (
                    <PrivateRoute>
                        <DashboardLayout />
                    </PrivateRoute>
                ),
                handle: {
                    meta: {
                        title: "Dashboard",
                        description:
                            "Access your TicketBari profile, bookings, tickets, and account tools.",
                        noIndex: true,
                    },
                },
                children: [
                    {
                        index: true,
                        element: <DashboardHome />,
                        handle: {
                            meta: {
                                title: "Dashboard",
                                description:
                                    "View your TicketBari dashboard and role-based account tools.",
                                noIndex: true,
                            },
                        },
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                        handle: {
                            meta: {
                                title: "My Profile",
                                description:
                                    "Review your TicketBari account profile and role information.",
                                noIndex: true,
                            },
                        },
                    },
                    {
                        path: "my-bookings",
                        element: (
                            <RoleRoute allowedRoles={["user"]}>
                                <MyBookings />
                            </RoleRoute>
                        ),
                        handle: {
                            meta: {
                                title: "My Bookings",
                                description:
                                    "Track your requested, approved, and paid TicketBari bookings.",
                                noIndex: true,
                            },
                        },
                    },
                    {
                        path: "transactions",
                        element: (
                            <RoleRoute allowedRoles={["user"]}>
                                <Transactions />
                            </RoleRoute>
                        ),
                        handle: {
                            meta: {
                                title: "Transactions",
                                description:
                                    "Review your paid TicketBari transactions and booking receipts.",
                                noIndex: true,
                            },
                        },
                    },
                    {
                        path: "add-ticket",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <AddTicket />
                            </RoleRoute>
                        ),
                        handle: {
                            meta: {
                                title: "Add Ticket",
                                description:
                                    "Create a new TicketBari ticket listing for travelers.",
                                noIndex: true,
                            },
                        },
                    },
                    {
                        path: "my-tickets",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <VendorMyTickets />
                            </RoleRoute>
                        ),
                        handle: {
                            meta: {
                                title: "My Tickets",
                                description:
                                    "Manage your vendor ticket listings on TicketBari.",
                                noIndex: true,
                            },
                        },
                    },
                    {
                        path: "requested-bookings",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <RequestedBookings />
                            </RoleRoute>
                        ),
                        handle: {
                            meta: {
                                title: "Requested Bookings",
                                description:
                                    "Review and manage traveler booking requests for your tickets.",
                                noIndex: true,
                            },
                        },
                    },
                    {
                        path: "revenue",
                        element: (
                            <RoleRoute allowedRoles={["vendor"]}>
                                <VendorRevenue />
                            </RoleRoute>
                        ),
                        handle: {
                            meta: {
                                title: "Revenue",
                                description:
                                    "View vendor revenue, sold tickets, and paid bookings on TicketBari.",
                                noIndex: true,
                            },
                        },
                    },
                    {
                        path: "manage-users",
                        element: (
                            <RoleRoute allowedRoles={["admin"]}>
                                <ManageUsers />
                            </RoleRoute>
                        ),
                        handle: {
                            meta: {
                                title: "Manage Users",
                                description:
                                    "Administer TicketBari user roles and account status.",
                                noIndex: true,
                            },
                        },
                    },
                    {
                        path: "manage-tickets",
                        element: (
                            <RoleRoute allowedRoles={["admin"]}>
                                <ManageTickets />
                            </RoleRoute>
                        ),
                        handle: {
                            meta: {
                                title: "Manage Tickets",
                                description:
                                    "Review and approve TicketBari ticket listings as an admin.",
                                noIndex: true,
                            },
                        },
                    },
                    {
                        path: "advertise-tickets",
                        element: (
                            <RoleRoute allowedRoles={["admin"]}>
                                <AdvertiseTickets />
                            </RoleRoute>
                        ),
                        handle: {
                            meta: {
                                title: "Advertise Tickets",
                                description:
                                    "Promote selected ticket listings across TicketBari.",
                                noIndex: true,
                            },
                        },
                    },
                ],
            },
        ],
    },
]);

export default router;
