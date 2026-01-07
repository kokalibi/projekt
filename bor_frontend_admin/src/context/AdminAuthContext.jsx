import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  // Frissítéskor ezek az állapotok elvesznek, így újra be kell jelentkezni
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);

  const login = (adminData, tokenValue) => {
    setToken(tokenValue);
    setAdmin(adminData);
    // Itt nem mentünk localStorage-ba!
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, token, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);