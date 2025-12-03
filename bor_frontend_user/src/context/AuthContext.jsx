import { createContext, useContext, useState, useEffect } from "react";
import API from "../api"; // a te axios instance-öd

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);    // bejelentkezett felhasználó adatai
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // TOKEN VÁLTOZÁSKOR USER BETÖLTÉSE
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    API.get("/auth/me")
      .then(res => setUser(res.data.user))
      .catch(() => {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
      });
  }, [token]);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
