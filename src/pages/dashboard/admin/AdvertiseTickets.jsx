import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaBullhorn,
  FaEye,
  FaEyeSlash,
  FaRoute,
  FaTicketAlt,
} from "react-icons/fa";

import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Not set";

  return new Date(dateValue).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const AdvertiseTickets = () => {
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminAdvertiseTickets"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/tickets/admin/advertisement");
      return response.data.tickets || [];
    },
  });

  const advertisedCount = tickets.filter((ticket) => ticket.isAdvertised).length;

  const advertiseMutation = useMutation({
    mutationFn: async ({ ticketId, isAdvertised }) => {
      const response = await axiosInstance.patch(
        `/api/tickets/admin/${ticketId}/advertise`,
        { isAdvertised }
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      Swal.fire({
        icon: "success",
        title: variables.isAdvertised
          ? "Ticket Advertised"
          : "Removed from Advertisement",
        timer: 1300,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["adminAdvertiseTickets"] });
      queryClient.invalidateQueries({ queryKey: ["advertisedTickets"] });
      queryClient.invalidateQueries({ queryKey: ["latestTickets"] });
      queryClient.invalidateQueries({ queryKey: ["approvedTickets"] });
    },
    onError: (error) => {
      Swal.fire(
        "Action Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    },
  });

  const handleAdvertiseToggle = async (ticket) => {
    const nextStatus = !ticket.isAdvertised;

    if (nextStatus && advertisedCount >= 6) {
      Swal.fire(
        "Limit Reached",
        "You can advertise maximum 6 tickets at a time.",
        "warning"
      );
      return;
    }

    const result = await Swal.fire({
      title: nextStatus ? "Advertise this ticket?" : "Remove advertisement?",
      text: nextStatus
        ? "This ticket will appear in the home page advertised section."
        : "This ticket will be removed from home page advertised section.",
      icon: nextStatus ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: nextStatus ? "Yes, advertise" : "Yes, remove",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      advertiseMutation.mutate({
        ticketId: ticket._id,
        isAdvertised: nextStatus,
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading approved tickets..." />;
  }

  if (isError) {
    return (
      <section className="dashboard-panel">
        <h1>Advertise Tickets</h1>
        <div className="empty-state">Failed to load approved tickets.</div>
      </section>
    );
  }

  return (
    <motion.section
      className="dashboard-panel advertise-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="dashboard-page-head advertise-head">
        <div>
          <span className="dashboard-kicker">Admin Spotlight Board</span>
          <h1>Advertise Tickets</h1>
          <p className="muted-text">
            Select up to 6 approved tickets for the home page advertised section.
          </p>
        </div>

        <div className="advertise-counter-card">
          <FaBullhorn />
          <strong>{advertisedCount}/6</strong>
          <span>Featured</span>
        </div>
      </div>

      <div className="advertise-limit-track">
        <div>
          <span style={{ width: `${(advertisedCount / 6) * 100}%` }}></span>
        </div>
        <p>{6 - advertisedCount} advertise slot remaining</p>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          No approved ticket found. First approve tickets from Manage Tickets.
        </div>
      ) : (
        <div className="advertise-ticket-grid">
          {tickets.map((ticket) => (
            <motion.article
              className={`advertise-ticket-card ${
                ticket.isAdvertised ? "active-advertise-card" : ""
              }`}
              key={ticket._id}
              whileHover={{ y: -6, rotate: ticket.isAdvertised ? 0 : -0.4 }}
            >
              <div className="advertise-image">
                {ticket.image ? (
                  <img src={ticket.image} alt={ticket.title} />
                ) : (
                  <FaTicketAlt />
                )}

                <span className="advertise-type">{ticket.transportType}</span>

                {ticket.isAdvertised && (
                  <span className="live-ad-tag">Live on Home</span>
                )}
              </div>

              <div className="advertise-content">
                <h3>{ticket.title}</h3>

                <p>
                  <FaRoute />
                  {ticket.from} → {ticket.to}
                </p>

                <small>{formatDateTime(ticket.departureDateTime)}</small>

                <div className="advertise-meta-row">
                  <span>${ticket.price}</span>
                  <span>{ticket.quantity} seats</span>
                  <span>{ticket.soldQuantity || 0} sold</span>
                </div>

                <div className="advertise-vendor">
                 <strong>Vendor:</strong> {ticket.vendorName || "Unknown Vendor"}
                </div>

                <button
                  type="button"
                  className={
                    ticket.isAdvertised
                      ? "remove-advertise-btn"
                      : "make-advertise-btn"
                  }
                  onClick={() => handleAdvertiseToggle(ticket)}
                  disabled={
                    advertiseMutation.isPending ||
                    (!ticket.isAdvertised && advertisedCount >= 6)
                  }
                >
                  {ticket.isAdvertised ? <FaEyeSlash /> : <FaEye />}
                  {ticket.isAdvertised ? "Remove Advertise" : "Make Advertised"}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default AdvertiseTickets;