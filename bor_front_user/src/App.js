import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarMenu from "./components/NavbarMenu";
import Home from "./pages/Home";
import WineList from "./pages/WineList";
import WineDetails from "./pages/WineDetails";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <NavbarMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/borok" element={<WineList />} />
          <Route path="/bor/:id" element={<WineDetails />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
