import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../app/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * INICIALIZÁLÁS
   * Megnézzük, hogy van-e elmentett token a telefonon.
   * Ha van, megpróbáljuk lekérni a felhasználó adatait.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("userToken");
        
        if (savedToken) {
          setAccessToken(savedToken);
          
          // Beállítjuk az alapértelmezett Authorization fejlécet az axios-hoz
          API.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
          
          const res = await API.get("/auth/me");
          setUser(res.data);
        }
      } catch (err) {
        console.log("Auth hiba az indításkor:", err.message);
        // Ha a token lejárt vagy érvénytelen, töröljük
        await logout(); 
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  /**
   * LOGIN
   * Elmentjük a tokent a memóriába és a perzisztens tárhelyre is.
   */
  const login = async (token, userData) => {
    try {
      setAccessToken(token);
      setUser(userData);
      
      // Axios fejléc frissítése
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      await AsyncStorage.setItem("userToken", token);
    } catch (e) {
      console.error("Hiba a token mentésekor:", e);
    }
  };

  /**
   * LOGOUT
   * Törlünk minden adatot a telefonról és a memóriából.
   */
  const logout = async () => {
    try {
      // Megpróbáljuk értesíteni a szervert (opcionális)
      await API.post("/auth/logout");
    } catch (e) {
      console.log("Szerver oldali kijelentkezés sikertelen, de helyileg törlünk.");
    }

    setAccessToken(null);
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
    await AsyncStorage.removeItem("userToken");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      login, 
      logout, 
      isAuthenticated: !!user, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);