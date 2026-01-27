import { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    // Profilkép frissítéséhez: időbélyeg hozzáadása
    if (userData?.profil_kep) {
      setUser(prev => ({ ...prev, profil_kep: userData.profil_kep + '?t=' + new Date().getTime() }));
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.error("Logout hiba:", e);
    }
    setAccessToken(null);
    setUser(null);
  };

  // EZ KELL AZ AZONNALI KÉPFRISSÍTÉSHEZ:
  const updateUser = (data) => {
    setUser((prev) => {
      if (!prev) return data;
      // Profilkép frissítéséhez: időbélyeg hozzáadása
      if (data.profil_kep) {
        return { ...prev, ...data, profil_kep: data.profil_kep + '?t=' + new Date().getTime() };
      }
      return { ...prev, ...data };
    });
  };

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

  useEffect(() => {
  const initAuth = async () => {
    try {
      // Megpróbálunk új access tokent kérni a HTTP-only cookie-ban lévő refresh token segítségével
      const res = await API.post("/auth/refresh");
      const token = res.data.accessToken;
      
      if (token) {
        setAccessToken(token);
        // Ha van token, lekérjük a user adatait is
        const me = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(me.data);
      }
    } catch (err) {
      console.log("Nincs aktív munkamenet");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  initAuth();
}, []);

  useEffect(() => {
    const interceptor = API.interceptors.request.use(async config => {
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
        setUser,
        updateUser, // Itt adjuk át
        accessToken,
        login,
        logout,
        loading,
        isAuthenticated: !!user
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);