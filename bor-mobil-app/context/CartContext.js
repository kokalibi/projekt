import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext(null);
const CART_KEY = "bor_mobile_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 KOSÁR BETÖLTÉSE INDÍTÁSKOR (AsyncStorage-ból)
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_KEY);
        if (stored) {
          setCart(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Hiba a kosár betöltésekor:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  // 💾 MENTÉS MINDEN VÁLTOZÁSNÁL
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      } catch (err) {
        console.error("Hiba a kosár mentésekor:", err);
      }
    };
    if (!loading) saveCart(); // Csak akkor mentsen, ha már betöltött az eredeti
  }, [cart, loading]);

  // ➕ KOSÁRBA TÉTEL (Webes logika)
  const addToCart = (bor) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.bor_id === bor.bor_id);
      if (existing) {
        return prev.map((i) =>
          i.bor_id === bor.bor_id
            ? { ...i, mennyiseg: i.mennyiseg + 1 }
            : i
        );
      }
      return [...prev, { ...bor, mennyiseg: 1 }];
    });
  };

  // 🔢 MENNYISÉG MÓDOSÍTÁS
  const updateQuantity = (bor_id, mennyiseg) => {
    if (mennyiseg < 1) {
      removeFromCart(bor_id);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.bor_id === bor_id ? { ...i, mennyiseg } : i))
    );
  };

  // ❌ TÖRLÉS A KOSÁRBÓL
  const removeFromCart = (bor_id) => {
    setCart((prev) => prev.filter((i) => i.bor_id !== bor_id));
  };

  // 🧹 KOSÁR ÜRÍTÉSE (Rendelés után)
  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem(CART_KEY);
  };

  // 💰 ÖSSZESEN KISZÁMÍTÁSA
  const totalAmount = cart.reduce((sum, item) => sum + item.ar * item.mennyiseg, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        itemCount: cart.length
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);