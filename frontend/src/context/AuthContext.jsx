// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem("is_guest") === "true");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = !!token || isGuest;

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.login({ email, password }); 

      const { token: jwtToken, user: userData } = res.data || {};

      if (!jwtToken) {
        throw new Error("Token tidak ditemukan di response");
      }

      setToken(jwtToken);
      setUser(userData);
      setIsGuest(false);

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("is_guest");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login gagal");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser = { name: "Guest", role: "guest" };

    setUser(guestUser);
    setToken(null);
    setIsGuest(true);

    localStorage.setItem("user", JSON.stringify(guestUser));
    localStorage.setItem("is_guest", "true");
    localStorage.removeItem("token");
  };

  const register = async (payload) => {
    setLoading(true);
    setError("");
    try {
      await api.register(payload);
    } catch (err) {
      console.error("Register error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("is_guest");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isGuest,
        isAuthenticated,
        loading,
        error,
        login,
        loginAsGuest,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
