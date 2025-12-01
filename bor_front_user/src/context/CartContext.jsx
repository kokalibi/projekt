import { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (wine) => {
    setCart((prev) => {
      const found = prev.find((item) => item.bor_id === wine.bor_id);
      if (found) {
        return prev.map((i) =>
          i.bor_id === wine.bor_id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...wine, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.bor_id !== id));
  };

  const changeQty = (id, qty) => {
    setCart((prev) =>
      prev.map((i) =>
        i.bor_id === id ? { ...i, qty: Number(qty) } : i
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQty }}>
      {children}
    </CartContext.Provider>
  );
}
