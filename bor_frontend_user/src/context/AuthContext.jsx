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
    // Profilkép frissítéséhez: időbélyeg hozzáadása
    if (userData?.profil_kep) {
      setUser(prev => ({ ...prev, profil_kep: userData.profil_kep + '?t=' + new Date().getTime() }));
    }
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
     ACCESS TOKEN FRISSÍTÉS
  ========================= */
  const refreshAccessToken = async () => {
    try {
      const res = await API.post("/auth/refresh");
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch {
      setUser(null);
      setAccessToken(null);
      return null;
    }
  };

  /* =========================
     OLDALBETÖLTÉSKOR: BE VAN-E JELENTKEZVE?
  ========================= */
 useEffect(() => {
  const initAuth = async () => {
    console.log("--- DEBUG: Auth ellenőrzés indul ---");
    try {
      // 1. Megpróbáljuk a frissítést
      console.log("DEBUG: Refresh kérés küldése a következő helyre: " + API.defaults.baseURL + "/auth/refresh");
      const res = await API.post("/auth/refresh");
      console.log("DEBUG: Szerver válasza (Refresh):", res.data);
      
      const token = res.data.accessToken;
      if (token) {
        setAccessToken(token);
        
        // 2. Felhasználói adatok lekérése az új tokennel
        console.log("DEBUG: Felhasználói adatok lekérése...");
        const me = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("DEBUG: Felhasználó sikeresen betöltve:", me.data);
        setUser(me.data);
      }
    } catch (err) {
      // Itt fogjuk látni a hiba valódi okát
      console.error("--- DEBUG: AUTH HIBA ---");
      console.error("Státusz kód:", err.response?.status);
      console.error("Hibaüzenet a szervertől:", err.response?.data?.error || "Nincs hibaüzenet");
      console.error("Kérés URL-je:", err.config?.url);
      
      if (err.response?.status === 403) {
        console.warn("TIPP: A 403-as hiba gyakran CORS beállítás vagy rossz baseURL miatt van!");
      }
      setUser(null);
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
    const interceptor = API.interceptors.request.use(async (config) => {
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
        loading,
        isAuthenticated: !!user
      }}
    >
      {/* Amíg tölt az auth (loading: true), addig nem mutatjuk az oldalt, elkerülve a villanást */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);