import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

const ErrorMessage = ({
  title = "Something went wrong",
  message = "Please try again or check your connection.",
  onRetry,
}) => {
  return (
    <div className="tb-error-box">
      <div className="tb-error-icon">
        <FaExclamationTriangle />
      </div>

      <h2>{title}</h2>
      <p>{message}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          <FaRedo />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;