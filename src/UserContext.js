import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/currentUser", { withCredentials: true })
      .then(res => {
        if (res.data.user) setUser(res.data.user);
      })
      .catch(() => console.error("Failed to fetch user details."));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
