import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";

// Ez a segédkomponens kezeli a betöltési állapotot
function RootLayoutNav() {
  const { loading } = useAuth();

  // Amíg az AuthContext ellenőrzi a tokent az AsyncStorage-ban, egy töltőképernyőt mutatunk
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#722f37" />
      </View>
    );
  }

  return (
    <Stack>
      {/* A bejelentkezési képernyő (ez az app/index.tsx) */}
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      
      {/* A főoldal és a tabok csoportja */}
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      
      {/* A rendelési folyamat képernyője */}
      <Stack.Screen 
        name="checkout" 
        options={{ 
          title: "Rendelés véglegesítése",
          headerTintColor: "#722f37"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // 1. Kívül van az Auth, mert a Cart használhatja a user adatokat
    <AuthProvider>
      {/* 2. Utána jön a Kosár, hogy mindenhol tudjunk hozzáadni/törölni */}
      <CartProvider>
        <RootLayoutNav />
      </CartProvider>
    </AuthProvider>
  );
}