import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaBus,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaShip,
  FaTicketAlt,
  FaTrain,
  FaUsers,
} from "react-icons/fa";

import axiosInstance from "../../api/axiosInstance";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const transportIcons = {
  Bus: <FaBus />,
  Train: <FaTrain />,
  Launch: <FaShip />,
  Plane: <FaPlaneDeparture />,
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Date not set";

  return new Date(dateValue).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });
};

const getCountdown = (departureDateTime) => {
  const now = new Date().getTime();
  const departure = new Date(departureDateTime).getTime();
  const distance = departure - now;

  if (distance <= 0) {
    return {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    expired: false,
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
};

const TicketDetails = () => {
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const {
    data: ticketData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ticketDetails", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/tickets/${id}`);
      return response.data.ticket;
    },
  });

  const {
    data: seatMapData,
    isLoading: seatLoading,
    refetch: refetchSeats,
  } = useQuery({
    queryKey: ["ticketSeats", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/tickets/${id}/seats`);
      return response.data;
    },
    enabled: Boolean(ticketData && ticketData.transportType === "Bus"),
    retry: false,
  });

  const countdown = useMemo(
    () => getCountdown(ticketData?.departureDateTime),
    [ticketData?.departureDateTime]
  );

  const bookingMutation = useMutation({
    mutationFn: async (bookingPayload) => {
      const response = await axiosInstance.post("/api/bookings", bookingPayload);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Booking Request Sent",
        text: "Vendor will review your booking request.",
        timer: 1600,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      setBookingQuantity(1);
      setSelectedSeats([]);
      refetch();
      refetchSeats();
    },
    onError: (error) => {
      Swal.fire(
        "Booking Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    },
  });

  const isBusTicket = ticketData?.transportType === "Bus";
  const availableSeats = Number(ticketData?.quantity || 0);
  const totalPrice = Number(ticketData?.price || 0) * Number(bookingQuantity || 0);

  const handleSeatToggle = (seat) => {
    if (seat.status === "booked") return;

    const seatName = seat.seat;

    if (selectedSeats.includes(seatName)) {
      const updatedSeats = selectedSeats.filter((item) => item !== seatName);
      setSelectedSeats(updatedSeats);
      setBookingQuantity(updatedSeats.length || 1);
      return;
    }

    if (selectedSeats.length >= availableSeats) {
      Swal.fire("Limit Reached", "No more seats are available.", "warning");
      return;
    }

    const updatedSeats = [...selectedSeats, seatName];
    setSelectedSeats(updatedSeats);
    setBookingQuantity(updatedSeats.length);
  };

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);

    if (value < 1) {
      setBookingQuantity(1);
      return;
    }

    if (value > availableSeats) {
      setBookingQuantity(availableSeats);
      return;
    }

    setBookingQuantity(value);
  };

  const handleSubmitBooking = (event) => {
    event.preventDefault();

    if (countdown.expired) {
      Swal.fire("Booking Closed", "Departure time has already passed.", "error");
      return;
    }

    if (availableSeats <= 0) {
      Swal.fire("Sold Out", "No tickets are available.", "error");
      return;
    }

    if (!bookingQuantity || bookingQuantity < 1) {
      Swal.fire("Invalid Quantity", "Please select at least 1 ticket.", "warning");
      return;
    }

    if (bookingQuantity > availableSeats) {
      Swal.fire(
        "Invalid Quantity",
        "Booking quantity cannot be greater than available seats.",
        "warning"
      );
      return;
    }

    if (isBusTicket && selectedSeats.length !== bookingQuantity) {
      Swal.fire(
        "Seat Required",
        "For bus tickets, selected seats count must match booking quantity.",
        "warning"
      );
      return;
    }

    const bookingPayload = {
      ticketId: id,
      bookingQuantity,
      selectedSeats: isBusTicket ? selectedSeats : [],
    };

    bookingMutation.mutate(bookingPayload);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading ticket details..." />;
  }

  if (isError || !ticketData) {
    return (
      <section className="details-error-card">
        <h1>Ticket not found</h1>
        <p>Could not load this ticket. Please try again.</p>
        <button type="button" onClick={refetch}>
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="ticket-details-page">
      <Link to="/all-tickets" className="back-link">
        <FaArrowLeft />
        Back to tickets
      </Link>

      <div className="ticket-details-shell">
        <motion.div
          className="details-visual-card"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="details-image-wrap">
            {ticketData.image ? (
              <img src={ticketData.image} alt={ticketData.title} />
            ) : (
              <div className="details-image-fallback">
                <FaTicketAlt />
              </div>
            )}

            <span className="details-transport-badge">
              {transportIcons[ticketData.transportType] || <FaTicketAlt />}
              {ticketData.transportType}
            </span>
          </div>

          <div className="details-route-card">
            <div>
              <small>From</small>
              <strong>{ticketData.from}</strong>
            </div>

            <span className="details-route-dash"></span>

            <div>
              <small>To</small>
              <strong>{ticketData.to}</strong>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="details-info-card"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="details-kicker">Protected Ticket Details</span>

          <h1>{ticketData.title}</h1>

          <div className="details-meta-grid">
            <div>
              <FaCalendarAlt />
              <span>Departure</span>
              <strong>{formatDateTime(ticketData.departureDateTime)}</strong>
            </div>

            <div>
              <FaUsers />
              <span>Available</span>
              <strong>{availableSeats} seats</strong>
            </div>

            <div>
              <FaMapMarkerAlt />
              <span>Vendor</span>
              <strong>{ticketData.vendorName}</strong>
            </div>

            <div>
              <FaTicketAlt />
              <span>Price</span>
              <strong>${ticketData.price}</strong>
            </div>
          </div>

          <div className="countdown-panel">
            <div className="countdown-heading">
              <FaClock />
              <span>{countdown.expired ? "Booking closed" : "Time left"}</span>
            </div>

            <div className="countdown-grid">
              <div>
                <strong>{countdown.days}</strong>
                <span>Days</span>
              </div>
              <div>
                <strong>{countdown.hours}</strong>
                <span>Hours</span>
              </div>
              <div>
                <strong>{countdown.minutes}</strong>
                <span>Minutes</span>
              </div>
              <div>
                <strong>{countdown.seconds}</strong>
                <span>Seconds</span>
              </div>
            </div>
          </div>

          {ticketData.perks?.length > 0 && (
            <div className="perks-box">
              <h3>Ticket Perks</h3>
              <div>
                {ticketData.perks.map((perk) => (
                  <span key={perk}>{perk}</span>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            className="book-now-btn"
            onClick={() => setIsModalOpen(true)}
            disabled={countdown.expired || availableSeats <= 0}
          >
            {countdown.expired
              ? "Booking Closed"
              : availableSeats <= 0
              ? "Sold Out"
              : "Book Now"}
          </button>
        </motion.div>
      </div>

      {isModalOpen && (
        <div className="booking-modal-overlay">
          <motion.div
            className="booking-modal"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            <span className="modal-kicker">Booking Request</span>
            <h2>{ticketData.title}</h2>
            <p>
              {ticketData.from} → {ticketData.to}
            </p>

            <form onSubmit={handleSubmitBooking} className="booking-form">
              {!isBusTicket && (
                <label>
                  Booking Quantity
                  <input
                    type="number"
                    min="1"
                    max={availableSeats}
                    value={bookingQuantity}
                    onChange={handleQuantityChange}
                  />
                </label>
              )}

              {isBusTicket && (
                <div className="seat-selection-box">
                  <div className="seat-selection-header">
                    <div>
                      <h3>Select Bus Seats</h3>
                      <p>
                        Selected {selectedSeats.length} of {availableSeats}{" "}
                        available seats
                      </p>
                    </div>

                    {seatLoading && <small>Loading seats...</small>}
                  </div>

                  <div className="seat-grid">
                    {seatMapData?.seats?.map((seat) => (
                      <button
                        type="button"
                        key={seat.seat}
                        className={`seat-btn ${
                          seat.status === "booked" ? "booked-seat" : ""
                        } ${
                          selectedSeats.includes(seat.seat)
                            ? "selected-seat"
                            : ""
                        }`}
                        disabled={seat.status === "booked"}
                        onClick={() => handleSeatToggle(seat)}
                      >
                        {seat.seat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="booking-summary">
                <p>
                  Quantity <strong>{bookingQuantity}</strong>
                </p>
                <p>
                  Unit Price <strong>${ticketData.price}</strong>
                </p>
                <p>
                  Total <strong>${totalPrice}</strong>
                </p>
              </div>

              <button
                type="submit"
                className="confirm-booking-btn"
                disabled={bookingMutation.isPending}
              >
                {bookingMutation.isPending
                  ? "Submitting..."
                  : "Submit Booking Request"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default TicketDetails;