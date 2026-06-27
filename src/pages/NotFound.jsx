import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="page-section not-found">
      <h1>404</h1>
      <p>Sorry, the page you are looking for was not found.</p>
      <Link to="/" className="primary-btn">
        Back to Home
      </Link>
    </section>
  );
};

export default NotFound;