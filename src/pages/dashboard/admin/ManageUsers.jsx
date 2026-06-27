import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaShieldAlt, FaUserCog, FaUserSlash, FaUsers } from "react-icons/fa";

import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const roleClassMap = {
  user: "role-user",
  vendor: "role-vendor",
  admin: "role-admin",
};

const ManageUsers = () => {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/users");
      return response.data.users || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ email, role }) => {
      const response = await axiosInstance.patch(
        `/api/users/${encodeURIComponent(email)}/role`,
        { role }
      );

      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Role Updated",
        timer: 1300,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error) => {
      Swal.fire(
        "Role Update Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    },
  });

  const fraudMutation = useMutation({
    mutationFn: async (email) => {
      const response = await axiosInstance.patch(
        `/api/users/${encodeURIComponent(email)}/fraud`
      );

      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Vendor Marked as Fraud",
        text: "This vendor's tickets are now hidden.",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error) => {
      Swal.fire(
        "Action Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    },
  });

  const handleRoleChange = async (user, role) => {
    const result = await Swal.fire({
      title: "Change user role?",
      text: `${user.email} will become ${role}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      updateRoleMutation.mutate({
        email: user.email,
        role,
      });
    }
  };

  const handleMarkFraud = async (user) => {
    const result = await Swal.fire({
      title: "Mark vendor as fraud?",
      text: "This will hide all tickets from this vendor.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, mark fraud",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      fraudMutation.mutate(user.email);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  if (isError) {
    return (
      <section className="dashboard-panel">
        <h1>Manage Users</h1>
        <div className="empty-state">Failed to load users.</div>
      </section>
    );
  }

  return (
    <motion.section
      className="dashboard-panel admin-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="dashboard-page-head admin-page-head">
        <div>
          <span className="dashboard-kicker">Admin Control Room</span>
          <h1>Manage Users</h1>
          <p className="muted-text">
            Control user roles, vendor permissions, and fraud vendor visibility.
          </p>
        </div>

        <div className="admin-head-icon">
          <FaUsers />
        </div>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">No users found.</div>
      ) : (
        <div className="admin-user-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Fraud</th>
                <th>Change Role</th>
                <th>Vendor Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.email}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-user-avatar">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.name} />
                        ) : (
                          <span>
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>

                      <div>
                        <strong>{user.name || "No Name"}</strong>
                        <small>
                          Joined{" "}
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span
                      className={`admin-role-pill ${
                        roleClassMap[user.role] || ""
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        user.isFraud ? "fraud-badge danger" : "fraud-badge safe"
                      }
                    >
                      {user.isFraud ? "Fraud" : "Safe"}
                    </span>
                  </td>

                  <td>
                    <select
                      className="admin-role-select"
                      value={user.role}
                      onChange={(event) =>
                        handleRoleChange(user, event.target.value)
                      }
                      disabled={updateRoleMutation.isPending}
                    >
                      <option value="user">User</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td>
                    {user.role === "vendor" ? (
                      <button
                        type="button"
                        className="fraud-action-btn"
                        onClick={() => handleMarkFraud(user)}
                        disabled={user.isFraud || fraudMutation.isPending}
                      >
                        <FaUserSlash />
                        {user.isFraud ? "Marked" : "Mark Fraud"}
                      </button>
                    ) : (
                      <span className="not-applicable">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.section>
  );
};

export default ManageUsers;