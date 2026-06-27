import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaCheckCircle, FaRoute, FaTimesCircle, FaUserClock } from "react-icons/fa";

import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const statusClassMap = {
  pending: "status-pending",
  accepted: "status-accepted",
  rejected: "status-rejected",
  cancelled: "status-cancelled",
  paid: "status-paid",
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Not set";

  return new Date(dateValue).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const RequestedBookings = () => {
  const queryClient = useQueryClient();

  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vendorRequestedBookings"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/bookings/vendor-requests");
      return response.data.bookings || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }) => {
      const response = await axiosInstance.patch(
        `/api/bookings/vendor/${bookingId}/status`,
        { status }
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      Swal.fire({
        icon: "success",
        title:
          variables.status === "accepted"
            ? "Booking Accepted"
            : "Booking Rejected",
        timer: 1400,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["vendorRequestedBookings"] });
      queryClient.invalidateQueries({ queryKey: ["vendorRevenueOverview"] });
    },
    onError: (error) => {
      Swal.fire(
        "Action Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    },
  });

  const handleStatusUpdate = async (bookingId, status) => {
    const result = await Swal.fire({
      title:
        status === "accepted"
          ? "Accept this booking?"
          : "Reject this booking?",
      text:
        status === "accepted"
          ? "User will be able to pay after acceptance."
          : "This booking request will be rejected.",
      icon: status === "accepted" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: status === "accepted" ? "Yes, accept" : "Yes, reject",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      updateStatusMutation.mutate({ bookingId, status });
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading requested bookings..." />;
  }

  if (isError) {
    return (
      <section className="dashboard-panel">
        <h1>Requested Bookings</h1>
        <div className="empty-state">Failed to load booking requests.</div>
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
          <span className="dashboard-kicker">Vendor Booking Desk</span>
          <h1>Requested Bookings</h1>
          <p className="muted-text">
            Review user booking requests and accept or reject them before payment.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">No booking request found yet.</div>
      ) : (
        <div className="vendor-request-list">
          {bookings.map((booking) => (
            <motion.article
              className="vendor-request-card"
              key={booking._id}
              whileHover={{ y: -5 }}
            >
              <div className="request-ticket-ribbon">
                <span></span>
                <span></span>
              </div>

              <div className="request-card-head">
                <div className="request-icon">
                  <FaUserClock />
                </div>

                <div>
                  <h3>{booking.ticketTitle}</h3>
                  <p>
                    <FaRoute />
                    {booking.from} → {booking.to}
                  </p>
                  <small>{formatDateTime(booking.departureDateTime)}</small>
                </div>
              </div>

              <div className="request-info-grid">
                <div>
                  <span>User</span>
                  <strong>{booking.userName}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{booking.userEmail}</strong>
                </div>

                <div>
                  <span>Quantity</span>
                  <strong>{booking.bookingQuantity}</strong>
                </div>

                <div>
                  <span>Seats</span>
                  <strong>
                    {booking.selectedSeats?.length
                      ? booking.selectedSeats.join(", ")
                      : "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>${booking.totalPrice}</strong>
                </div>

                <div>
                  <span>Requested</span>
                  <strong>{formatDateTime(booking.createdAt)}</strong>
                </div>
              </div>

              <div className="request-action-row">
                <span
                  className={`booking-status ${
                    statusClassMap[booking.status] || ""
                  }`}
                >
                  {booking.status}
                </span>

                {booking.status === "pending" && (
                  <div className="request-actions">
                    <button
                      type="button"
                      className="accept-request-btn"
                      disabled={updateStatusMutation.isPending}
                      onClick={() => handleStatusUpdate(booking._id, "accepted")}
                    >
                      <FaCheckCircle />
                      Accept
                    </button>

                    <button
                      type="button"
                      className="reject-request-btn"
                      disabled={updateStatusMutation.isPending}
                      onClick={() => handleStatusUpdate(booking._id, "rejected")}
                    >
                      <FaTimesCircle />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default RequestedBookings;