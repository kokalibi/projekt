import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../app/api"; // Az általad létrehozott api.js

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- AUTOMATIKUS BELÉPÉS (Mint a weben) ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Megnézzük, van-e mentett token a telefonon
        const savedToken = await AsyncStorage.getItem("userToken");
        
        if (savedToken) {
          setAccessToken(savedToken);
          
          // Lekérjük a friss adatokat a backend /auth/me végpontjáról
          const res = await API.get("/auth/me", {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          setUser(res.data);
        }
      } catch (err) {
        console.log("Auth inicializációs hiba:", err.message);
        await logout(); // Hiba esetén törlünk mindent
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // --- LOGIN FUNKCIÓ ---
  const login = async (token, userData) => {
    try {
      setAccessToken(token);
      setUser(userData);
      // Elmentjük a tokent a telefon memóriájába
      await AsyncStorage.setItem("userToken", token);
    } catch (e) {
      console.error("Token mentési hiba:", e);
    }
  };

  // --- LOGOUT FUNKCIÓ ---
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.log("Szerver oldali logout hiba (nem kritikus)");
    }
    setAccessToken(null);
    setUser(null);
    await AsyncStorage.removeItem("userToken");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);