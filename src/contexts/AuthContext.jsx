import { createContext, useCallback, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { authClient } from "../lib/auth-client";

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
      photoURL: profile?.photoURL || profile?.image || "",
    };

    setUser(loggedUser);
    setDbUser(profile);
    setRole(userRole || profile?.role || "user");
  };

  const loadProfileAfterJwt = async () => {
    const profileResponse = await axiosInstance.get("/api/users/me");
    const roleResponse = await axiosInstance.get("/api/users/role");

    const profile = profileResponse.data.user;
    const userRole = roleResponse.data.role;

    setAuthData(profile, userRole);
    return profile;
  };

  const createLocalJwtSession = async (userInfo) => {
    await axiosInstance.post("/api/users", {
      name: userInfo.name || "TicketBari User",
      email: userInfo.email,
      photoURL: userInfo.photoURL || "",
    });

    await axiosInstance.post("/api/jwt/create", {
      email: userInfo.email,
    });

    return loadProfileAfterJwt();
  };

  const registerUser = async (userInfo) => {
    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        image: userInfo.photoURL || "",
      });

      if (error) {
        throw new Error(error.message || "Registration failed.");
      }

      await createLocalJwtSession({
        name: userInfo.name,
        email: userInfo.email,
        photoURL: userInfo.photoURL || "",
      });

      return data;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (userInfo) => {
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: userInfo.email,
        password: userInfo.password,
      });

      if (error) {
        throw new Error(error.message || "Login failed.");
      }

      await axiosInstance.post("/api/jwt/create", {
        email: userInfo.email,
      });

      await loadProfileAfterJwt();

      return data;
    } finally {
      setLoading(false);
    }
  };

  const syncBetterAuthUser = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get("/api/better-auth/sync");

      setAuthData(response.data.user, response.data.role);

      return response.data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const googleLoginUser = async () => {
    const clientUrl = import.meta.env.VITE_CLIENT_URL || window.location.origin;

    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${clientUrl}/auth/callback`,
      errorCallbackURL: `${clientUrl}/login`,
      newUserCallbackURL: `${clientUrl}/auth/callback`,
    });
  };

  const refreshUser = async () => {
    setLoading(true);

    try {
      await axiosInstance.get("/api/jwt/me");
      await loadProfileAfterJwt();
    } catch {
      try {
        const response = await axiosInstance.get("/api/better-auth/sync");
        setAuthData(response.data.user, response.data.role);
      } catch {
        setUser(null);
        setDbUser(null);
        setRole(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);

    try {
      await authClient.signOut();
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
    syncBetterAuthUser,
    logoutUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;