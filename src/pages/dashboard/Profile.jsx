import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { dbUser, role } = useAuth();

  return (
    <motion.section
      className="dashboard-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1>My Profile</h1>
      <p className="muted-text">Your TicketBari account information.</p>

      <div className="profile-card">
        <div className="profile-photo">
          {dbUser?.photoURL ? (
            <img src={dbUser.photoURL} alt={dbUser.name} />
          ) : (
            <span>{dbUser?.name?.charAt(0)?.toUpperCase() || "U"}</span>
          )}
        </div>

        <div>
          <h2>{dbUser?.name || "No Name"}</h2>
          <p>Email: {dbUser?.email}</p>
          <p>Role: {role}</p>
          <p>Status: {dbUser?.isFraud ? "Fraud Vendor" : "Active"}</p>
        </div>
      </div>
    </motion.section>
  );
};

export default Profile;