import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });

  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3001/auth/currentUser", { withCredentials: true });
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("userUpdated")); // 🔥 Notify all components
      } else {
        setUser(null);
        localStorage.removeItem("currentUser");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      localStorage.removeItem("currentUser");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    
    // 🔥 Listen for "userUpdated" event across the app
    const handleUserUpdate = () => {
      setUser(JSON.parse(localStorage.getItem("currentUser")) || null);
    };
    window.addEventListener("userUpdated", handleUserUpdate);
    window.addEventListener("storage", handleUserUpdate); // Sync across tabs

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
