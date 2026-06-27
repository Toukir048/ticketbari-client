import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBus,
  FaPlaneDeparture,
  FaShip,
  FaTicketAlt,
  FaTrain,
} from "react-icons/fa";

const transportIcons = {
  Bus: <FaBus />,
  Train: <FaTrain />,
  Launch: <FaShip />,
  Plane: <FaPlaneDeparture />,
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Date not set";

  return new Date(dateValue).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const TicketCard = ({ ticket, variant = "default" }) => {
  return (
    <motion.article
      className={`ticket-card ${variant === "featured" ? "featured-ticket" : ""}`}
      whileHover={{ y: -8, rotate: -0.4 }}
      transition={{ type: "spring", stiffness: 210, damping: 16 }}
    >
      <div className="ticket-cut ticket-cut-left"></div>
      <div className="ticket-cut ticket-cut-right"></div>

      <div className="ticket-image-wrap">
        {ticket?.image ? (
          <img src={ticket.image} alt={ticket.title} />
        ) : (
          <div className="ticket-image-fallback">
            <FaTicketAlt />
          </div>
        )}

        <span className="transport-badge">
          {transportIcons[ticket?.transportType] || <FaTicketAlt />}
          {ticket?.transportType}
        </span>

        {ticket?.isAdvertised && <span className="ad-badge">Featured</span>}
      </div>

      <div className="ticket-card-body">
        <div className="route-line">
          <div>
            <small>From</small>
            <strong>{ticket?.from}</strong>
          </div>

          <span className="route-dots"></span>

          <div>
            <small>To</small>
            <strong>{ticket?.to}</strong>
          </div>
        </div>

        <h3>{ticket?.title}</h3>

        <div className="ticket-meta">
          <p>
            <span>Departure</span>
            {formatDateTime(ticket?.departureDateTime)}
          </p>

          <p>
            <span>Available</span>
            {ticket?.quantity || 0} seats
          </p>
        </div>

        <div className="ticket-card-footer">
          <div className="ticket-price">
            <small>Starts from</small>
            <strong>${ticket?.price}</strong>
          </div>

          <Link to={`/tickets/${ticket?._id}`} className="ticket-details-btn">
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default TicketCard;