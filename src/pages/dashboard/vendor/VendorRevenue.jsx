import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaReceipt,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa";

import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const chartColors = ["#0284c7", "#7c3aed", "#f59e0b", "#ef4444", "#22c55e"];

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Not set";

  return new Date(dateValue).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const VendorRevenue = () => {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vendorRevenueOverview"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/vendor/revenue-overview");
      return response.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading revenue dashboard..." />;
  }

  if (isError) {
    return (
      <section className="dashboard-panel">
        <h1>Revenue Overview</h1>
        <div className="empty-state">Failed to load revenue data.</div>
      </section>
    );
  }

  const overview = data?.overview || {};
  const charts = data?.charts || {};
  const recentTransactions = data?.recentTransactions || [];

  const summaryCards = [
    {
      title: "Total Revenue",
      value: `$${overview.totalRevenue || 0}`,
      icon: <FaMoneyBillWave />,
      note: "Paid booking income",
    },
    {
      title: "Paid Bookings",
      value: overview.paidBookings || 0,
      icon: <FaReceipt />,
      note: "Completed payments",
    },
    {
      title: "Total Tickets",
      value: overview.totalTickets || 0,
      icon: <FaTicketAlt />,
      note: "Added by you",
    },
    {
      title: "Sold Quantity",
      value: overview.totalSoldQuantity || 0,
      icon: <FaUsers />,
      note: "Total sold seats",
    },
  ];

  const revenueByTicket = charts.revenueByTicket || [];
  const bookingStatusChart = charts.bookingStatusChart || [];
  const monthlyRevenue = charts.monthlyRevenue || [];

  return (
    <motion.section
      className="dashboard-panel vendor-revenue-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="dashboard-page-head revenue-head">
        <div>
          <span className="dashboard-kicker">Vendor Finance Room</span>
          <h1>Revenue Overview</h1>
          <p className="muted-text">
            Track revenue, booking status, ticket performance, and recent
            payment activity.
          </p>
        </div>

        <div className="revenue-mark">
          <FaChartLine />
          <span>Live</span>
        </div>
      </div>

      <div className="revenue-summary-grid">
        {summaryCards.map((card) => (
          <motion.div
            className="revenue-summary-card"
            key={card.title}
            whileHover={{ y: -6 }}
          >
            <div className="revenue-summary-icon">{card.icon}</div>
            <div>
              <span>{card.title}</span>
              <strong>{card.value}</strong>
              <small>{card.note}</small>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="vendor-chart-grid">
        <div className="vendor-chart-card wide-chart">
          <div className="chart-card-head">
            <h3>Revenue by Ticket</h3>
            <p>Which ticket generated most revenue.</p>
          </div>

          {revenueByTicket.length === 0 ? (
            <div className="mini-empty">No revenue data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={310}>
              <BarChart data={revenueByTicket}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ticketTitle" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRevenue" radius={[10, 10, 0, 0]} fill="#0284c7" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="vendor-chart-card">
          <div className="chart-card-head">
            <h3>Booking Status</h3>
            <p>Request movement summary.</p>
          </div>

          {bookingStatusChart.length === 0 ? (
            <div className="mini-empty">No booking data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={310}>
              <PieChart>
                <Pie
                  data={bookingStatusChart}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={100}
                  label
                >
                  {bookingStatusChart.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="vendor-chart-card wide-chart">
          <div className="chart-card-head">
            <h3>Monthly Revenue</h3>
            <p>Payment trend by month.</p>
          </div>

          {monthlyRevenue.length === 0 ? (
            <div className="mini-empty">No monthly revenue yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={310}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="vendor-chart-card recent-payment-card">
          <div className="chart-card-head">
            <h3>Recent Payments</h3>
            <p>Latest paid transactions.</p>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="mini-empty">No transaction yet.</div>
          ) : (
            <div className="recent-payment-list">
              {recentTransactions.map((transaction) => (
                <article key={transaction._id} className="recent-payment-row">
                  <div>
                    <h4>{transaction.ticketTitle}</h4>
                    <p>{transaction.transactionId}</p>
                    <small>{formatDateTime(transaction.paymentDate)}</small>
                  </div>

                  <strong>${transaction.amount}</strong>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default VendorRevenue;