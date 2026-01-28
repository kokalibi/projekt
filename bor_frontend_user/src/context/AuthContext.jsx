import { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
      BEJELENTKEZÉS
  ========================= */
  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  /* =========================
      ADATOK FRISSÍTÉSE (Profilkép nélkül)
  ========================= */
  const updateUser = (data) => {
    setUser((prev) => (prev ? { ...prev, ...data } : data));
  };

  /* =========================
      KIJELENTKEZÉS
  ========================= */
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.error("Logout hiba:", e);
    }
    setAccessToken(null);
    setUser(null);
  };

  /* =========================
      OLDALBETÖLTÉSKOR: AUTOMATIKUS BELÉPÉS
  ========================= */
  useEffect(() => {
    const initAuth = async () => {
      console.log("--- DEBUG: Auth ellenőrzés indul ---");
      try {
        // 1. Megpróbálunk új tokent kérni a sütiben lévő refresh tokennel
        const res = await API.post("/auth/refresh");
        console.log("DEBUG: Refresh válasz:", res.data);
        
        const token = res.data.accessToken;
        if (token) {
          setAccessToken(token);
          
          // 2. Felhasználói adatok lekérése (SQL hiba elkerülése végett profilkép nélkül)
          const me = await API.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log("DEBUG: Felhasználó betöltve:", me.data);
          setUser(me.data);
        }
      } catch (err) {
        console.error("--- DEBUG: AUTH HIBA ---");
        console.error("Státusz:", err.response?.status);
        console.error("Üzenet:", err.response?.data?.error);
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
        console.log("--- DEBUG: Auth folyamat vége ---");
      }
    };
    initAuth();
  }, []);

  /* =========================
      AXIOS INTERCEPTOR
  ========================= */
  useEffect(() => {
    const interceptor = API.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
    return () => API.interceptors.request.eject(interceptor);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated: !!user
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);