const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner-circle"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;