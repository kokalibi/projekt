import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "draga_borok_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * BETÖLTÉS
   * Alkalmazás indításakor visszaolvassuk a kosár tartalmát.
   */
  useEffect(() => {
    const loadCartFromStorage = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (err) {
        console.error("Kosár betöltési hiba:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCartFromStorage();
  }, []);

  /**
   * AUTOMATIKUS MENTÉS
   * Minden alkalommal elmentjük a kosarat, ha változik a tartalma.
   */
  useEffect(() => {
    const saveCartToStorage = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (err) {
        console.error("Kosár mentési hiba:", err);
      }
    };
    if (!loading) saveCartToStorage();
  }, [cart, loading]);

  /**
   * KOSÁRBA TÉTEL
   * Ha a bor már benne van, növeljük a mennyiséget.
   */
  const addToCart = (bor) => {
    setCart((prevCart) => {
      const isItemInCart = prevCart.find((item) => item.bor_id === bor.bor_id);

      if (isItemInCart) {
        return prevCart.map((item) =>
          item.bor_id === bor.bor_id
            ? { ...item, mennyiseg: (item.mennyiseg || 1) + 1 }
            : item
        );
      }

      return [...prevCart, { ...bor, mennyiseg: 1 }];
    });
  };

  /**
   * MENNYISÉG MÓDOSÍTÁSA
   */
  const updateQuantity = (bor_id, ujMennyiseg) => {
    if (ujMennyiseg < 1) {
      removeFromCart(bor_id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => 
        item.bor_id === bor_id ? { ...item, mennyiseg: ujMennyiseg } : item
      )
    );
  };

  /**
   * ELTÁVOLÍTÁS
   */
  const removeFromCart = (bor_id) => {
    setCart((prevCart) => prevCart.filter((item) => item.bor_id !== bor_id));
  };

  /**
   * KOSÁR ÜRÍTÉSE
   * Sikeres rendelés után hívjuk meg.
   */
  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
  };

  // Számított értékek az UI-nak
  const totalAmount = cart.reduce((sum, item) => sum + (item.ar * item.mennyiseg), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.mennyiseg, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);