import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaRoute,
  FaShieldAlt,
  FaTicketAlt,
  FaTimesCircle,
} from "react-icons/fa";

import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const statusClassMap = {
  pending: "status-pending",
  approved: "status-paid",
  rejected: "status-rejected",
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Not set";

  return new Date(dateValue).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const ManageTickets = () => {
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminTickets"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/tickets/admin/all");
      return response.data.tickets || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }) => {
      const response = await axiosInstance.patch(
        `/api/tickets/admin/${ticketId}/status`,
        { status }
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      Swal.fire({
        icon: "success",
        title:
          variables.status === "approved"
            ? "Ticket Approved"
            : "Ticket Rejected",
        timer: 1400,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
      queryClient.invalidateQueries({ queryKey: ["approvedTickets"] });
      queryClient.invalidateQueries({ queryKey: ["advertisedTickets"] });
      queryClient.invalidateQueries({ queryKey: ["latestTickets"] });
    },
    onError: (error) => {
      Swal.fire(
        "Action Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    },
  });

  const handleStatusUpdate = async (ticket, status) => {
    const result = await Swal.fire({
      title:
        status === "approved" ? "Approve this ticket?" : "Reject this ticket?",
      text:
        status === "approved"
          ? "Approved tickets will be visible to users."
          : "Rejected tickets cannot be updated or deleted by vendor.",
      icon: status === "approved" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: status === "approved" ? "Yes, approve" : "Yes, reject",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      updateStatusMutation.mutate({
        ticketId: ticket._id,
        status,
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading tickets for admin..." />;
  }

  if (isError) {
    return (
      <section className="dashboard-panel">
        <h1>Manage Tickets</h1>
        <div className="empty-state">Failed to load tickets.</div>
      </section>
    );
  }

  return (
    <motion.section
      className="dashboard-panel admin-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="dashboard-page-head admin-page-head">
        <div>
          <span className="dashboard-kicker">Admin Verification Desk</span>
          <h1>Manage Tickets</h1>
          <p className="muted-text">
            Review vendor submitted tickets and control approval status.
          </p>
        </div>

        <div className="admin-head-icon">
          <FaShieldAlt />
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">No tickets found.</div>
      ) : (
        <div className="admin-ticket-list">
          {tickets.map((ticket) => (
            <motion.article
              className="admin-ticket-card"
              key={ticket._id}
              whileHover={{ y: -5 }}
            >
              <div className="admin-ticket-image">
                {ticket.image ? (
                  <img src={ticket.image} alt={ticket.title} />
                ) : (
                  <FaTicketAlt />
                )}

                {ticket.isAdvertised && (
                  <span className="admin-advertised-tag">Advertised</span>
                )}
              </div>

              <div className="admin-ticket-content">
                <h3>{ticket.title}</h3>

                <p>
                  <FaRoute />
                  {ticket.from} → {ticket.to}
                </p>

                <small>{formatDateTime(ticket.departureDateTime)}</small>

                <div className="admin-ticket-meta">
                  <span>{ticket.transportType}</span>
                  <span>${ticket.price}</span>
                  <span>{ticket.quantity} available</span>
                  <span>{ticket.soldQuantity || 0} sold</span>
                </div>

                <div className="admin-vendor-line">
                  <strong>Vendor:</strong> {ticket.vendorName} |{" "}
                  {ticket.vendorEmail}
                </div>
              </div>

              <div className="admin-ticket-actions">
                <span
                  className={`booking-status ${
                    statusClassMap[ticket.verificationStatus] || ""
                  }`}
                >
                  {ticket.verificationStatus}
                </span>

                {ticket.verificationStatus !== "approved" && (
                  <button
                    type="button"
                    className="admin-approve-btn"
                    disabled={updateStatusMutation.isPending}
                    onClick={() => handleStatusUpdate(ticket, "approved")}
                  >
                    <FaCheckCircle />
                    Approve
                  </button>
                )}

                {ticket.verificationStatus !== "rejected" && (
                  <button
                    type="button"
                    className="admin-reject-btn"
                    disabled={updateStatusMutation.isPending}
                    onClick={() => handleStatusUpdate(ticket, "rejected")}
                  >
                    <FaTimesCircle />
                    Reject
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default ManageTickets;