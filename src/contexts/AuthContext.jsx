import { createContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";

import axiosInstance from "../api/axiosInstance";
import { auth } from "../config/firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthData = (profile, userRole) => {
    const loggedUser = {
      name: profile?.name || "TicketBari User",
      email: profile?.email,
      photoURL: profile?.photoURL || "",
    };

    setUser(loggedUser);
    setDbUser(profile);
    setRole(userRole || profile?.role || "user");
  };

  const saveUserAndCreateToken = async (userInfo) => {
    setLoading(true);

    try {
      await axiosInstance.post("/api/users", userInfo);

      await axiosInstance.post("/api/jwt/create", {
        email: userInfo.email,
      });

      const profileResponse = await axiosInstance.get("/api/users/me");
      const roleResponse = await axiosInstance.get("/api/users/role");

      const profile = profileResponse.data.user;
      const userRole = roleResponse.data.role;

      setAuthData(profile, userRole);

      return profile;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (userInfo) => {
    return saveUserAndCreateToken(userInfo);
  };

  const registerUser = async (userInfo) => {
    return saveUserAndCreateToken(userInfo);
  };

  const googleLoginUser = async (firebaseUser) => {
    const userInfo = {
      name: firebaseUser?.displayName || "Google User",
      email: firebaseUser?.email,
      photoURL: firebaseUser?.photoURL || "",
    };

    return saveUserAndCreateToken(userInfo);
  };

  const refreshUser = async () => {
    setLoading(true);

    try {
      await axiosInstance.get("/api/jwt/me");

      const profileResponse = await axiosInstance.get("/api/users/me");
      const roleResponse = await axiosInstance.get("/api/users/role");

      const profile = profileResponse.data.user;
      const userRole = roleResponse.data.role;

      setAuthData(profile, userRole);
    } catch {
      setUser(null);
      setDbUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);

    try {
      if (auth) {
        await signOut(auth);
      }

      await axiosInstance.post("/api/jwt/logout");
    } finally {
      setUser(null);
      setDbUser(null);
      setRole(null);
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
    googleLoginUser,
    logoutUser,
    refreshUser,
    saveUserAndCreateToken,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;