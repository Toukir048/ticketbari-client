import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBus,
  FaClock,
  FaPlaneDeparture,
  FaRoute,
  FaShieldAlt,
  FaShip,
  FaTicketAlt,
  FaTrain,
} from "react-icons/fa";

import axiosInstance from "../../api/axiosInstance";
import TicketCard from "../../components/shared/TicketCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const fetchAdvertisedTickets = async () => {
  const response = await axiosInstance.get("/api/tickets/advertised");
  return response.data.tickets || [];
};

const fetchLatestTickets = async () => {
  const response = await axiosInstance.get("/api/tickets/latest");
  return response.data.tickets || [];
};

const Home = () => {
  const {
    data: advertisedTickets = [],
    isLoading: advertisedLoading,
    isError: advertisedError,
  } = useQuery({
    queryKey: ["advertisedTickets"],
    queryFn: fetchAdvertisedTickets,
  });

  const {
    data: latestTickets = [],
    isLoading: latestLoading,
    isError: latestError,
  } = useQuery({
    queryKey: ["latestTickets"],
    queryFn: fetchLatestTickets,
  });

  const transportItems = [
    {
      name: "Bus",
      icon: <FaBus />,
      text: "City to city road trips",
    },
    {
      name: "Train",
      icon: <FaTrain />,
      text: "Comfortable long routes",
    },
    {
      name: "Launch",
      icon: <FaShip />,
      text: "River and coastal rides",
    },
    {
      name: "Plane",
      icon: <FaPlaneDeparture />,
      text: "Fast domestic travel",
    },
  ];

  const steps = [
    {
      title: "Choose Route",
      text: "Search by from and to location.",
      icon: <FaRoute />,
    },
    {
      title: "Book Request",
      text: "Send booking request to vendor.",
      icon: <FaTicketAlt />,
    },
    {
      title: "Pay Securely",
      text: "Pay after vendor accepts.",
      icon: <FaShieldAlt />,
    },
  ];

  return (
    <div className="home-page">
      <section className="tb-hero">
        <div className="hero-text-block">
          <motion.span
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Smart transport booking platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Book your next ride without the counter queue.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            TicketBari connects users, vendors, and admins in one clean booking
            flow for bus, train, launch, and plane tickets.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <Link to="/all-tickets" className="hero-primary-btn">
              Explore Tickets <FaArrowRight />
            </Link>

            <Link to="/register" className="hero-secondary-btn">
              Become a Member
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hero-ticket-board"
          initial={{ opacity: 0, x: 36, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="mini-ticket top-mini-ticket">
            <span>Route</span>
            <strong>Dhaka → Chittagong</strong>
          </div>

          <div className="hero-main-ticket">
            <div className="ticket-punch punch-left"></div>
            <div className="ticket-punch punch-right"></div>

            <div className="hero-ticket-top">
              <FaTicketAlt />
              <span>TB-2026</span>
            </div>

            <h3>Live Ticket Desk</h3>

            <div className="moving-route">
              <span></span>
              <i></i>
              <span></span>
            </div>

            <div className="hero-ticket-grid">
              <div>
                <small>Booking</small>
                <strong>Pending</strong>
              </div>
              <div>
                <small>Vendor</small>
                <strong>Accept</strong>
              </div>
              <div>
                <small>Payment</small>
                <strong>Ready</strong>
              </div>
            </div>
          </div>

          <div className="mini-ticket bottom-mini-ticket">
            <FaClock />
            <strong>Fast dashboard control</strong>
          </div>
        </motion.div>
      </section>

      <section className="transport-strip">
        {transportItems.map((item, index) => (
          <motion.div
            className="transport-tile"
            key={item.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="transport-icon">{item.icon}</div>
            <div>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Admin Selected</span>
            <h2>Advertised Tickets</h2>
          </div>

          <Link to="/all-tickets" className="small-link">
            See all tickets <FaArrowRight />
          </Link>
        </div>

        {advertisedLoading ? (
          <LoadingSpinner message="Loading advertised tickets..." />
        ) : advertisedError ? (
          <div className="empty-state">Could not load advertised tickets.</div>
        ) : advertisedTickets.length === 0 ? (
          <div className="empty-state">
            No advertised tickets available right now.
          </div>
        ) : (
          <div className="ticket-grid advertised-grid">
            {advertisedTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} variant="featured" />
            ))}
          </div>
        )}
      </section>

      <section className="workflow-section">
        <div className="workflow-intro">
          <span className="section-kicker">Booking Flow</span>
          <h2>Three steps. One clean trip.</h2>
          <p>
            The platform keeps the full booking journey visible from request to
            payment confirmation.
          </p>
        </div>

        <div className="workflow-grid">
          {steps.map((step, index) => (
            <motion.div
              className="workflow-card"
              key={step.title}
              whileHover={{ y: -6 }}
            >
              <span className="step-number">0{index + 1}</span>
              <div className="workflow-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="home-section latest-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Fresh Routes</span>
            <h2>Latest Tickets</h2>
          </div>

          <Link to="/all-tickets" className="small-link">
            Browse more <FaArrowRight />
          </Link>
        </div>

        {latestLoading ? (
          <LoadingSpinner message="Loading latest tickets..." />
        ) : latestError ? (
          <div className="empty-state">Could not load latest tickets.</div>
        ) : latestTickets.length === 0 ? (
          <div className="empty-state">No latest tickets available right now.</div>
        ) : (
          <div className="ticket-grid latest-grid">
            {latestTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;