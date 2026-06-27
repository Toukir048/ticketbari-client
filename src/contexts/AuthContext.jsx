import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUserAndCreateToken = async (userInfo) => {
    const userPayload = {
      name: userInfo.name,
      email: userInfo.email,
      photoURL: userInfo.photoURL || "",
    };

    await axiosInstance.post("/api/users", userPayload);

    await axiosInstance.post("/api/jwt/create", {
      email: userPayload.email,
    });

    const profileResponse = await axiosInstance.get("/api/users/me");
    const roleResponse = await axiosInstance.get("/api/users/role");

    setUser(userPayload);
    setDbUser(profileResponse.data.user);
    setRole(roleResponse.data.role);

    return profileResponse.data.user;
  };

  const loginUser = async ({ email, name, photoURL }) => {
    setLoading(true);

    try {
      const loggedUser = await saveUserAndCreateToken({
        email,
        name,
        photoURL,
      });

      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async ({ email, name, photoURL }) => {
    setLoading(true);

    try {
      const registeredUser = await saveUserAndCreateToken({
        email,
        name,
        photoURL,
      });

      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);

    try {
      await axiosInstance.post("/api/jwt/logout");
      setUser(null);
      setDbUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    setLoading(true);

    try {
      const profileResponse = await axiosInstance.get("/api/users/me");
      const roleResponse = await axiosInstance.get("/api/users/role");

      const profileUser = profileResponse.data.user;

      setUser({
        name: profileUser.name,
        email: profileUser.email,
        photoURL: profileUser.photoURL || "",
      });

      setDbUser(profileUser);
      setRole(roleResponse.data.role);
    } catch (error) {
      setUser(null);
      setDbUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const authInfo = {
    user,
    dbUser,
    role,
    loading,
    loginUser,
    registerUser,
    logoutUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;