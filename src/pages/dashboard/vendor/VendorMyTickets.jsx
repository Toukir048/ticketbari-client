import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaRoute,
  FaSave,
  FaTimes,
  FaTrash,
  FaTicketAlt,
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

const getDateTimeLocalValue = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};

const VendorMyTickets = () => {
  const queryClient = useQueryClient();
  const [editingTicket, setEditingTicket] = useState(null);

  const {
    data: tickets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vendorMyTickets"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/tickets/my-tickets");
      return response.data.tickets || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ticketId) => {
      const response = await axiosInstance.delete(`/api/tickets/${ticketId}`);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Ticket Deleted",
        timer: 1300,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["vendorMyTickets"] });
    },
    onError: (error) => {
      Swal.fire(
        "Delete Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ ticketId, payload }) => {
      const response = await axiosInstance.patch(`/api/tickets/${ticketId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Ticket Updated",
        timer: 1300,
        showConfirmButton: false,
      });

      setEditingTicket(null);
      queryClient.invalidateQueries({ queryKey: ["vendorMyTickets"] });
    },
    onError: (error) => {
      Swal.fire(
        "Update Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    },
  });

  const handleDelete = async (ticketId) => {
    const result = await Swal.fire({
      title: "Delete this ticket?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(ticketId);
    }
  };

  const handleEditOpen = (ticket) => {
    setEditingTicket({
      ...ticket,
      perksText: ticket.perks?.join(", ") || "",
      departureDateTime: getDateTimeLocalValue(ticket.departureDateTime),
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditingTicket((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = (event) => {
    event.preventDefault();

    const payload = {
      title: editingTicket.title,
      from: editingTicket.from,
      to: editingTicket.to,
      transportType: editingTicket.transportType,
      price: Number(editingTicket.price),
      quantity: Number(editingTicket.quantity),
      departureDateTime: editingTicket.departureDateTime,
      image: editingTicket.image,
      perks: editingTicket.perksText
        ? editingTicket.perksText
            .split(",")
            .map((perk) => perk.trim())
            .filter(Boolean)
        : [],
    };

    updateMutation.mutate({
      ticketId: editingTicket._id,
      payload,
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading vendor tickets..." />;
  }

  if (isError) {
    return (
      <section className="dashboard-panel">
        <h1>My Tickets</h1>
        <div className="empty-state">Failed to load your tickets.</div>
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
          <span className="dashboard-kicker">Vendor Inventory</span>
          <h1>My Added Tickets</h1>
          <p className="muted-text">
            Check approval status, update active tickets, or remove unwanted tickets.
          </p>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">You have not added any ticket yet.</div>
      ) : (
        <div className="vendor-ticket-list">
          {tickets.map((ticket) => (
            <motion.article
              className="vendor-ticket-row"
              key={ticket._id}
              whileHover={{ y: -5 }}
            >
              <div className="vendor-ticket-image">
                {ticket.image ? (
                  <img src={ticket.image} alt={ticket.title} />
                ) : (
                  <FaTicketAlt />
                )}
              </div>

              <div className="vendor-ticket-info">
                <h3>{ticket.title}</h3>

                <p>
                  <FaRoute />
                  {ticket.from} → {ticket.to}
                </p>

                <small>{formatDateTime(ticket.departureDateTime)}</small>

                <div className="vendor-ticket-mini-grid">
                  <span>{ticket.transportType}</span>
                  <span>${ticket.price}</span>
                  <span>{ticket.quantity} seats</span>
                  <span>{ticket.soldQuantity || 0} sold</span>
                </div>
              </div>

              <div className="vendor-ticket-actions">
                <span
                  className={`booking-status ${
                    statusClassMap[ticket.verificationStatus] || ""
                  }`}
                >
                  {ticket.verificationStatus}
                </span>

                <button
                  type="button"
                  className="vendor-edit-btn"
                  onClick={() => handleEditOpen(ticket)}
                  disabled={ticket.verificationStatus === "rejected"}
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  type="button"
                  className="vendor-delete-btn"
                  onClick={() => handleDelete(ticket._id)}
                  disabled={ticket.verificationStatus === "rejected"}
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {editingTicket && (
        <div className="booking-modal-overlay">
          <motion.div
            className="booking-modal vendor-edit-modal"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setEditingTicket(null)}
            >
              ×
            </button>

            <span className="modal-kicker">Update Ticket</span>
            <h2>Edit Ticket Info</h2>
            <p>Rejected tickets cannot be edited from vendor dashboard.</p>

            <form className="vendor-edit-form" onSubmit={handleUpdateSubmit}>
              <div className="form-grid two-col">
                <label>
                  Title
                  <input
                    type="text"
                    name="title"
                    value={editingTicket.title}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label>
                  Transport
                  <select
                    name="transportType"
                    value={editingTicket.transportType}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="Bus">Bus</option>
                    <option value="Train">Train</option>
                    <option value="Launch">Launch</option>
                    <option value="Plane">Plane</option>
                  </select>
                </label>

                <label>
                  From
                  <input
                    type="text"
                    name="from"
                    value={editingTicket.from}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label>
                  To
                  <input
                    type="text"
                    name="to"
                    value={editingTicket.to}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label>
                  Price
                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={editingTicket.price}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label>
                  Quantity
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={editingTicket.quantity}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label>
                  Departure
                  <input
                    type="datetime-local"
                    name="departureDateTime"
                    value={editingTicket.departureDateTime}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label>
                  Image URL
                  <input
                    type="url"
                    name="image"
                    value={editingTicket.image}
                    onChange={handleEditChange}
                    required
                  />
                </label>
              </div>

              <label className="full-label">
                Perks
                <input
                  type="text"
                  name="perksText"
                  value={editingTicket.perksText}
                  onChange={handleEditChange}
                />
              </label>

              <div className="modal-action-row">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setEditingTicket(null)}
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save-btn"
                  disabled={updateMutation.isPending}
                >
                  <FaSave />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.section>
  );
};

export default VendorMyTickets;