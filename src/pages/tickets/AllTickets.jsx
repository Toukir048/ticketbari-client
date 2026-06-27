import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaFilter, FaLocationArrow, FaRedo, FaSearch } from "react-icons/fa";

import axiosInstance from "../../api/axiosInstance";
import TicketCard from "../../components/shared/TicketCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { transportTypes } from "../../utils/constants";

const fetchApprovedTickets = async ({ queryKey }) => {
  const [, filters] = queryKey;

  const params = {
    page: filters.page,
    limit: filters.limit,
  };

  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.transportType && filters.transportType !== "All") {
    params.transportType = filters.transportType;
  }
  if (filters.sort) params.sort = filters.sort;

  const response = await axiosInstance.get("/api/tickets/approved", {
    params,
  });

  return response.data;
};

const AllTickets = () => {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    transportType: "All",
    sort: "",
    page: 1,
    limit: 6,
  });

  const [formValues, setFormValues] = useState({
    from: "",
    to: "",
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["approvedTickets", filters],
    queryFn: fetchApprovedTickets,
    keepPreviousData: true,
  });

  const tickets = data?.tickets || [];
  const pagination = data?.pagination || {
    totalTickets: 0,
    currentPage: 1,
    perPage: 6,
    totalPages: 1,
  };

  const handleInputChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    setFilters((previous) => ({
      ...previous,
      from: formValues.from.trim(),
      to: formValues.to.trim(),
      page: 1,
    }));
  };

  const handleTransportChange = (event) => {
    setFilters((previous) => ({
      ...previous,
      transportType: event.target.value,
      page: 1,
    }));
  };

  const handleSortChange = (event) => {
    setFilters((previous) => ({
      ...previous,
      sort: event.target.value,
      page: 1,
    }));
  };

  const handleLimitChange = (event) => {
    setFilters((previous) => ({
      ...previous,
      limit: Number(event.target.value),
      page: 1,
    }));
  };

  const handlePageChange = (pageNumber) => {
    setFilters((previous) => ({
      ...previous,
      page: pageNumber,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleReset = () => {
    const resetValues = {
      from: "",
      to: "",
    };

    setFormValues(resetValues);

    setFilters({
      from: "",
      to: "",
      transportType: "All",
      sort: "",
      page: 1,
      limit: 6,
    });
  };

  const totalPages = Math.max(Number(pagination.totalPages || 1), 1);
  const currentPage = Number(pagination.currentPage || 1);

  return (
    <section className="all-tickets-page">
      <motion.div
        className="tickets-hero-panel"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <span className="tickets-kicker">TicketBari Routes</span>
          <h1>Find the right ticket without jumping between counters.</h1>
          <p>
            Search approved tickets by route, transport type, price, and page
            through available travel options.
          </p>
        </div>

        <div className="tickets-hero-stamp">
          <FaLocationArrow />
          <span>Live Search</span>
        </div>
      </motion.div>

      <motion.div
        className="ticket-filter-station"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <div className="filter-title">
          <FaFilter />
          <div>
            <h2>Route Control</h2>
            <p>Use filters to narrow down approved tickets.</p>
          </div>
        </div>

        <form className="ticket-search-form" onSubmit={handleSearch}>
          <label>
            From
            <input
              type="text"
              name="from"
              placeholder="Dhaka"
              value={formValues.from}
              onChange={handleInputChange}
            />
          </label>

          <label>
            To
            <input
              type="text"
              name="to"
              placeholder="Chittagong"
              value={formValues.to}
              onChange={handleInputChange}
            />
          </label>

          <button type="submit" className="filter-search-btn">
            <FaSearch />
            Search
          </button>
        </form>

        <div className="filter-grid">
          <label>
            Transport
            <select value={filters.transportType} onChange={handleTransportChange}>
              {transportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Sort by Price
            <select value={filters.sort} onChange={handleSortChange}>
              <option value="">Latest First</option>
              <option value="price-asc">Low to High</option>
              <option value="price-desc">High to Low</option>
            </select>
          </label>

          <label>
            Tickets Per Page
            <select value={filters.limit} onChange={handleLimitChange}>
              <option value="6">6 tickets</option>
              <option value="9">9 tickets</option>
            </select>
          </label>

          <button type="button" className="filter-reset-btn" onClick={handleReset}>
            <FaRedo />
            Reset
          </button>
        </div>
      </motion.div>

      <div className="tickets-result-bar">
        <p>
          Showing <strong>{tickets.length}</strong> of{" "}
          <strong>{pagination.totalTickets}</strong> approved tickets
        </p>

        <button type="button" onClick={refetch}>
          Refresh List
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading approved tickets..." />
      ) : isError ? (
        <div className="empty-state">
          Failed to load tickets. Please check server connection.
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          No tickets matched your search. Try another route or filter.
        </div>
      ) : (
        <motion.div
          className="ticket-grid all-ticket-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.07,
              },
            },
          }}
        >
          {tickets.map((ticket) => (
            <motion.div
              key={ticket._id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <TicketCard ticket={ticket} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  className={pageNumber === currentPage ? "active-page" : ""}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default AllTickets;