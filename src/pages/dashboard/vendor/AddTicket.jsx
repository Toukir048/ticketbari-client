import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaPlusCircle, FaTicketAlt } from "react-icons/fa";

import axiosInstance from "../../../api/axiosInstance";

const AddTicket = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const ticketPayload = {
        title: data.title,
        from: data.from,
        to: data.to,
        transportType: data.transportType,
        price: Number(data.price),
        quantity: Number(data.quantity),
        departureDateTime: data.departureDateTime,
        image: data.image,
        perks: data.perks
          ? data.perks
              .split(",")
              .map((perk) => perk.trim())
              .filter(Boolean)
          : [],
      };

      await axiosInstance.post("/api/tickets", ticketPayload);

      Swal.fire({
        icon: "success",
        title: "Ticket Added",
        text: "Ticket is waiting for admin approval.",
        timer: 1600,
        showConfirmButton: false,
      });

      reset();
    } catch (error) {
      Swal.fire(
        "Failed to Add Ticket",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };

  return (
    <motion.section
      className="dashboard-panel vendor-form-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="dashboard-page-head">
        <div>
          <span className="dashboard-kicker">Vendor Ticket Desk</span>
          <h1>Add New Ticket</h1>
          <p className="muted-text">
            Add a ticket for admin review. Approved tickets will be visible to users.
          </p>
        </div>
      </div>

      <form className="vendor-ticket-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-card-title">
          <FaTicketAlt />
          <div>
            <h2>Ticket Information</h2>
            <p>Fill the route, transport, price, seat and departure details.</p>
          </div>
        </div>

        <div className="form-grid two-col">
          <label>
            Ticket Title
            <input
              type="text"
              placeholder="Dhaka to Chittagong AC Bus"
              {...register("title", { required: "Ticket title is required" })}
            />
            {errors.title && <small>{errors.title.message}</small>}
          </label>

          <label>
            Transport Type
            <select
              {...register("transportType", {
                required: "Transport type is required",
              })}
            >
              <option value="">Select Type</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Launch">Launch</option>
              <option value="Plane">Plane</option>
            </select>
            {errors.transportType && <small>{errors.transportType.message}</small>}
          </label>

          <label>
            From
            <input
              type="text"
              placeholder="Dhaka"
              {...register("from", { required: "From location is required" })}
            />
            {errors.from && <small>{errors.from.message}</small>}
          </label>

          <label>
            To
            <input
              type="text"
              placeholder="Chittagong"
              {...register("to", { required: "To location is required" })}
            />
            {errors.to && <small>{errors.to.message}</small>}
          </label>

          <label>
            Price
            <input
              type="number"
              min="1"
              placeholder="850"
              {...register("price", {
                required: "Price is required",
                min: { value: 1, message: "Price must be greater than 0" },
              })}
            />
            {errors.price && <small>{errors.price.message}</small>}
          </label>

          <label>
            Ticket Quantity
            <input
              type="number"
              min="1"
              placeholder="40"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Quantity must be greater than 0" },
              })}
            />
            {errors.quantity && <small>{errors.quantity.message}</small>}
          </label>

          <label>
            Departure Date & Time
            <input
              type="datetime-local"
              {...register("departureDateTime", {
                required: "Departure date and time is required",
              })}
            />
            {errors.departureDateTime && (
              <small>{errors.departureDateTime.message}</small>
            )}
          </label>

          <label>
            Image URL
            <input
              type="url"
              placeholder="https://example.com/ticket-image.jpg"
              {...register("image", { required: "Image URL is required" })}
            />
            {errors.image && <small>{errors.image.message}</small>}
          </label>
        </div>

        <label className="full-label">
          Perks
          <input
            type="text"
            placeholder="AC, Water Bottle, Window Seat"
            {...register("perks")}
          />
          <span>Write perks separated by comma.</span>
        </label>

        <button type="submit" className="vendor-submit-btn" disabled={isSubmitting}>
          <FaPlusCircle />
          {isSubmitting ? "Adding Ticket..." : "Add Ticket"}
        </button>
      </form>
    </motion.section>
  );
};

export default AddTicket;