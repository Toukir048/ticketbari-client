import { useEffect, useState } from "react";
import { FaEnvelope, FaIdBadge, FaShieldAlt, FaUserCircle } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";

const getInitials = (name = "") => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
};

const isValidImageUrl = (url) => {
  return (
    typeof url === "string" &&
    url.trim() !== "" &&
    url !== "undefined" &&
    url !== "null" &&
    (url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:image"))
  );
};

const Profile = () => {
  const { user, dbUser, role } = useAuth();
  const [imageError, setImageError] = useState(false);

  const profileName = user?.name || dbUser?.name || "TicketBari User";
  const profileEmail = user?.email || dbUser?.email || "Not provided";
  const profileRole = role || dbUser?.role || "user";
  const profilePhoto =
    user?.photoURL || user?.image || dbUser?.photoURL || dbUser?.image || "";

  const shouldShowImage = isValidImageUrl(profilePhoto) && !imageError;

  useEffect(() => {
    setImageError(false);
  }, [profilePhoto]);

  return (
    <section className="dashboard-page">
      <div className="profile-polish-card">
        <div className="profile-cover-glow"></div>

        <div className="profile-main">
          {shouldShowImage ? (
            <img
              src={profilePhoto}
              alt={profileName}
              className="profile-page-avatar"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="profile-page-avatar-fallback">
              {getInitials(profileName)}
            </div>
          )}

          <div>
            <p className="section-kicker">Account Profile</p>
            <h2>{profileName}</h2>
            <p className="profile-subtitle">
              Manage your TicketBari account identity and access role.
            </p>
          </div>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-box">
            <FaUserCircle />
            <span>Name</span>
            <strong>{profileName}</strong>
          </div>

          <div className="profile-info-box">
            <FaEnvelope />
            <span>Email</span>
            <strong>{profileEmail}</strong>
          </div>

          <div className="profile-info-box">
            <FaShieldAlt />
            <span>Role</span>
            <strong className="role-badge">{profileRole}</strong>
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