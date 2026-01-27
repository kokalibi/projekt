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
      try {
        const token = await refreshAccessToken();
        if (!token) return;

        const me = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(me.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
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