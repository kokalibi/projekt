import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "bor_webshop_cart";

export function CartProvider({ children }) {
  // 🔄 KEZDŐÁLLAPOT: localStorage-ből
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 💾 MINDEN VÁLTOZÁSNÁL MENTÉS
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // ➕ KOSÁRBA
  const addToCart = (bor) => {
    setCart(prev => {
      const existing = prev.find(i => i.bor_id === bor.bor_id);
      if (existing) {
        return prev.map(i =>
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
    if (mennyiseg < 1) return;
    setCart(prev =>
      prev.map(i =>
        i.bor_id === bor_id ? { ...i, mennyiseg } : i
      )
    );
  };

  // ❌ TÉTEL TÖRLÉS
  const removeFromCart = (bor_id) => {
    setCart(prev => prev.filter(i => i.bor_id !== bor_id));
  };

  // 🧹 TELJES KOSÁR ÜRÍTÉS
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
