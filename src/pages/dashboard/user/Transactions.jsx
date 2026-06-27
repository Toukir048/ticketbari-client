import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaReceipt } from "react-icons/fa";

import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Not set";

  return new Date(dateValue).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const Transactions = () => {
  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myTransactions"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/payments/my-transactions");
      return response.data.transactions || [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading transaction history..." />;
  }

  if (isError) {
    return (
      <section className="dashboard-panel">
        <h1>Transaction History</h1>
        <div className="empty-state">Failed to load transactions.</div>
      </section>
    );
  }

  return (
    <motion.section
      className="dashboard-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="dashboard-page-head">
        <div>
          <span className="dashboard-kicker">Payment Records</span>
          <h1>Transaction History</h1>
          <p className="muted-text">
            Paid ticket transactions with transaction ID, amount, ticket title,
            and payment date.
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">No transaction found yet.</div>
      ) : (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <motion.article
              className="transaction-card"
              key={transaction._id}
              whileHover={{ y: -5 }}
            >
              <div className="transaction-icon">
                <FaReceipt />
              </div>

              <div className="transaction-content">
                <h3>{transaction.ticketTitle}</h3>
                <p>Transaction ID: {transaction.transactionId}</p>
                <small>{formatDateTime(transaction.paymentDate)}</small>
              </div>

              <div className="transaction-amount">
                <span>Amount</span>
                <strong>${transaction.amount}</strong>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default Transactions;