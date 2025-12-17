import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import AppNavbar from "./components/Navbar";
import OrdersAdmin from "./pages/OrdersAdmin";
import OrderDetailsAdmin from "./pages/OrderDetailsAdmin";

import AddBor from "./pages/AddBor";
import ManageBor from "./pages/ManageBor";
import BorReszletek from "./pages/BorReszletek";

export default function App() {
  return (
    <Router>
      <AppNavbar />
      <Container className="mt-4">
        <Routes>
          {/* Admin kezdooldal = rendelesek */}
          <Route path="/" element={<OrdersAdmin />} />

          {/* Rendeles reszletek */}
          <Route path="/orders/:id" element={<OrderDetailsAdmin />} />

          {/* Bor kezeles marad */}
          <Route path="/add" element={<AddBor />} />
          <Route path="/manage" element={<ManageBor />} />
          <Route path="/bor/:id" element={<BorReszletek />} />
        </Routes>
      </Container>
    </Router>
  );
}
