import { FaEnvelope, FaIdBadge, FaShieldAlt, FaUserCircle } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { user, dbUser, role } = useAuth();

  return (
    <section className="dashboard-page">
      <div className="profile-polish-card">
        <div className="profile-cover-glow"></div>

        <div className="profile-main">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name || "User"}
              className="profile-page-avatar"
            />
          ) : (
            <div className="profile-page-avatar profile-page-avatar-fallback">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <p className="section-kicker">Account Profile</p>
            <h2>{user?.name || dbUser?.name || "TicketBari User"}</h2>
            <p className="profile-subtitle">
              Manage your TicketBari account identity and access role.
            </p>
          </div>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-box">
            <FaUserCircle />
            <span>Name</span>
            <strong>{user?.name || dbUser?.name || "Not provided"}</strong>
          </div>

          <div className="profile-info-box">
            <FaEnvelope />
            <span>Email</span>
            <strong>{user?.email || dbUser?.email || "Not provided"}</strong>
          </div>

          <div className="profile-info-box">
            <FaShieldAlt />
            <span>Role</span>
            <strong className="role-badge">{role || dbUser?.role || "user"}</strong>
          </div>

          <div className="profile-info-box">
            <FaIdBadge />
            <span>Status</span>
            <strong>
              {dbUser?.isFraud ? "Marked as Fraud" : "Verified Account"}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;