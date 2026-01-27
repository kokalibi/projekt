import { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Belépéskor beállítjuk a tokent és a felhasználót
  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  // Kilépéskor hívjuk a backendet is, hogy törölje a Refresh Token sütit
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.error("Logout hiba:", e);
    }
    setAccessToken(null);
    setUser(null);
  };

  const updateUser = (data) => {
    setUser((prev) => (prev ? { ...prev, ...data } : data));
  };

  /**
   * AUTOMATIKUS ÚJRATÖLTÉS FRISSÍTÉSKOR
   * Ez a rész felel azért, hogy F5 után visszakapjuk a munkamenetet
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Megpróbálunk új Access Tokent kérni a httpOnly Refresh Cookie-val
        const res = await API.post("/auth/refresh");
        const token = res.data.accessToken;

        if (token) {
          setAccessToken(token);
          // 2. Ha kaptunk tokent, azonnal lekérjük a user adatait is
          const me = await API.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(me.data);
        }
      } catch (err) {
        // Ha nincs süti vagy lejárt, nem történik semmi, a user marad null
        console.log("Nincs aktív munkamenet.");
      } finally {
        // Csak akkor engedjük renderelni az App-ot, ha lefutott az ellenőrzés
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * AXIOS INTERCEPTOR
   * Automatikusan minden API híváshoz hozzácsapja a tokent a fejlécben
   */
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
        setUser,
        updateUser,
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