import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserContextType } from "../../context/UserContextTypes";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role")
  );

  // Sync state with localStorage
  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

  return (
    <UserContext.Provider value={{ username, setUsername, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
