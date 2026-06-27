import { FaTicketAlt } from "react-icons/fa";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="tb-loader-wrap">
      <div className="tb-loader-card">
        <div className="tb-loader-ticket">
          <FaTicketAlt />
        </div>

        <div className="tb-loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;