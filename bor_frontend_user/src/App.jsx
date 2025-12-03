import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavbarMenu from "./components/NavbarMenu";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import WineList from "./pages/WineList";
import WineDetails from "./pages/WineDetails";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          
          <NavbarMenu />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/borok" element={<WineList />} />
            <Route path="/bor/:id" element={<WineDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>

          <Footer />

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
