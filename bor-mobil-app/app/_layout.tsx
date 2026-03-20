import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* A Stack kezeli a navigációt a (tabs) és a login között */}
        <Stack screenOptions={{ headerShown: false }}>
          {/* A (tabs) mappa az alapértelmezett */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* A login külön oldal, nincs alul menüje */}
          <Stack.Screen name="login" options={{ title: 'Bejelentkezés', headerShown: true }} />
          <Stack.Screen name="register" options={{ title: 'Regisztráció', headerShown: true }} />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}