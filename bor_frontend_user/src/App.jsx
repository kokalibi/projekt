import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"; // Fontos, hogy a fenti CSS-t beolvassa!

import NavbarMenu from "./components/NavbarMenu";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import WineList from "./pages/WineList";
import WineDetails from "./pages/WineDetails";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserChat from "./components/UserChat";
import Profile from "./pages/Profile";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Ez a wrapper felelős azért, hogy a lábléc lenn maradjon */}
          <div className="d-flex flex-column min-vh-100">
            
            <NavbarMenu />

            {/* A main rész "flex-grow-1" osztálya kitölti a teret, lelöki a footert */}
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/borok" element={<WineList />} />
                <Route path="/bor/:id" element={<WineDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profil" element={<Profile />} />
              </Routes>
            </main>

            <UserChat />
            <Footer />

          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;