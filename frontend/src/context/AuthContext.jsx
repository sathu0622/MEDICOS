// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores user info
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user on first load
  useEffect(() => {
    if (window.location.pathname === "/login") {
    setLoading(false);
    return;
  }
    const fetchUser = async () => {
      try {
        const res = await api.get("/UserOperations/getUser");
        setUser(res.data.data); // user object from backend
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await api.post("/UserOperations/login", { email, password });
    setUser(res.data.user);
    return res.data.user;
  };

  //google 
  const loginWithGoogle = async () => {
    window.location.href = "http://localhost:4000/UserOperations/google";
  };

  // Logout
  const logout = async () => {
    await api.post("/UserOperations/logout");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
