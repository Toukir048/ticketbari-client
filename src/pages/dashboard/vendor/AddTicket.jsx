import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaCloudUploadAlt, FaPlusCircle, FaTicketAlt } from "react-icons/fa";

import axiosInstance from "../../../api/axiosInstance";
import useAuth from "../../../hooks/useAuth";
import { uploadImageToImgbb } from "../../../services/imageUpload";

const AddTicket = () => {
  const { user } = useAuth();
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const imageRegister = register("image", {
    required: "Ticket image is required.",
    onChange: (event) => {
      const file = event.target.files?.[0];

      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      } else {
        setPreviewImage("");
      }
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const imageFile = data.image?.[0];
      const uploadedImageURL = await uploadImageToImgbb(imageFile);
      const departureDateTime =
        data.departureDate && data.departureTime
          ? `${data.departureDate}T${data.departureTime}`
          : "";

      const arrivalDateTime =
        data.arrivalDate && data.arrivalTime
          ? `${data.arrivalDate}T${data.arrivalTime}`
          : "";

      const ticketPayload = {
        title: data.title,
        transportType: data.transportType,
        from: data.from,
        to: data.to,

        departureDate: data.departureDate,
        departureTime: data.departureTime,
        departureDateTime,

        arrivalDate: data.arrivalDate,
        arrivalTime: data.arrivalTime,
        arrivalDateTime,

        price: Number(data.price),
        quantity: Number(data.quantity),
        availableQuantity: Number(data.quantity),

        image: uploadedImageURL,
        imageURL: uploadedImageURL,

        description: data.description,
        facilities: data.facilities
          ? data.facilities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
          : [],

        vendorName: user?.name || "TicketBari Vendor",
        vendorEmail: user?.email,
      };

      await axiosInstance.post("/api/tickets", ticketPayload);

      Swal.fire({
        icon: "success",
        title: "Ticket Added",
        text: "Your ticket has been submitted for admin approval.",
        timer: 1600,
        showConfirmButton: false,
      });

      reset();
      setPreviewImage("");
    } catch (error) {
      Swal.fire(
        "Ticket Add Failed",
        error.response?.data?.message || error.message || "Something went wrong.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="dashboard-page">
      <div className="dashboard-page-head">
        <p className="section-kicker">Vendor Ticket Desk</p>
        <h1>Add New Ticket</h1>
        <p className="muted-text">
          Upload a transport ticket with route, schedule, price, seat quantity,
          and a real ticket image. Admin approval is required before it becomes public.
        </p>
      </div>

      <div className="dashboard-panel vendor-form-panel">
        <form className="vendor-ticket-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card-title">
            <FaTicketAlt />
            <div>
              <h2>Ticket Information</h2>
              <p>Keep information accurate so users can book with confidence.</p>
            </div>
          </div>

          <div className="form-grid two-col">
            <label>
              Ticket Title
              <input
                type="text"
                placeholder="Example: Dhaka to Cox's Bazar Premium Bus"
                {...register("title", { required: "Ticket title is required." })}
              />
              {errors.title && <small>{errors.title.message}</small>}
            </label>

            <label>
              Transport Type
              <select
                {...register("transportType", {
                  required: "Transport type is required.",
                })}
              >
                <option value="">Select transport</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Launch">Launch</option>
                <option value="Air">Air</option>
              </select>
              {errors.transportType && <small>{errors.transportType.message}</small>}
            </label>
          </div>

          <div className="form-grid two-col">
            <label>
              From
              <input
                type="text"
                placeholder="Dhaka"
                {...register("from", { required: "Starting location is required." })}
              />
              {errors.from && <small>{errors.from.message}</small>}
            </label>

            <label>
              To
              <input
                type="text"
                placeholder="Chattogram"
                {...register("to", { required: "Destination is required." })}
              />
              {errors.to && <small>{errors.to.message}</small>}
            </label>
          </div>

          <div className="form-grid two-col">
            <label>
              Departure Date
              <input
                type="date"
                {...register("departureDate", {
                  required: "Departure date is required.",
                })}
              />
              {errors.departureDate && <small>{errors.departureDate.message}</small>}
            </label>

            <label>
              Departure Time
              <input
                type="time"
                {...register("departureTime", {
                  required: "Departure time is required.",
                })}
              />
              {errors.departureTime && <small>{errors.departureTime.message}</small>}
            </label>
          </div>

          <div className="form-grid two-col">
            <label>
              Arrival Date
              <input type="date" {...register("arrivalDate")} />
            </label>

            <label>
              Arrival Time
              <input type="time" {...register("arrivalTime")} />
            </label>
          </div>

          <div className="form-grid two-col">
            <label>
              Price
              <input
                type="number"
                min="1"
                placeholder="1200"
                {...register("price", {
                  required: "Price is required.",
                  min: {
                    value: 1,
                    message: "Price must be greater than 0.",
                  },
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
                  required: "Ticket quantity is required.",
                  min: {
                    value: 1,
                    message: "Quantity must be at least 1.",
                  },
                })}
              />
              {errors.quantity && <small>{errors.quantity.message}</small>}
            </label>
          </div>

          <label className="full-label">
            Facilities
            <input
              type="text"
              placeholder="AC, WiFi, Recliner Seat, Water Bottle"
              {...register("facilities")}
            />
            <span>Use comma separated values.</span>
          </label>

          <label className="full-label">
            Description
            <textarea
              rows="4"
              placeholder="Write short details about this ticket..."
              {...register("description", {
                required: "Description is required.",
              })}
            ></textarea>
            {errors.description && <small>{errors.description.message}</small>}
          </label>

          <label className="ticket-image-upload-box">
            <input
              type="file"
              accept="image/*"
              name={imageRegister.name}
              ref={imageRegister.ref}
              onBlur={imageRegister.onBlur}
              onChange={imageRegister.onChange}
            />

            <div className="ticket-image-upload-content">
              <FaCloudUploadAlt />
              <strong>Upload ticket image</strong>
              <span>PNG, JPG, JPEG or WEBP supported</span>
            </div>

            {errors.image && <small>{errors.image.message}</small>}
          </label>

          {previewImage && (
            <div className="ticket-image-preview-card">
              <img src={previewImage} alt="Ticket preview" />
              <div>
                <strong>Image Preview</strong>
                <p>This image will be uploaded to ImgBB before saving ticket.</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="vendor-submit-btn"
            disabled={isSubmitting}
          >
            <FaPlusCircle />
            {isSubmitting ? "Uploading Ticket..." : "Submit Ticket for Approval"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddTicket;