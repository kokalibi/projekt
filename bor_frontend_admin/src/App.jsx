import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import AppNavbar from "./components/Navbar";

import OrdersAdmin from "./pages/OrdersAdmin";
import OrderDetailsAdmin from "./pages/OrderDetailsAdmin";
import AddBor from "./pages/AddBor";
import ManageBor from "./pages/ManageBor";
import BorReszletek from "./pages/BorReszletek";
import AdminLogin from "./pages/AdminLogin";

import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { AdminAuthProvider } from "./context/AdminAuthContext";

export default function App() {
  return (
    <AdminAuthProvider>
      <Router>

        {/* Navbar csak admin felületen – ha akarod később feltételessé tehetjük */}
        <AppNavbar />

        <Container className="mt-4">
          <Routes>

            {/* ADMIN LOGIN – NEM VÉDETT */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ADMIN KEZDŐOLDAL = RENDELÉSEK */}
            <Route
              path="/"
              element={
                <AdminProtectedRoute>
                  <OrdersAdmin />
                </AdminProtectedRoute>
              }
            />

            {/* RENDELÉS RÉSZLETEK */}
            <Route
              path="/orders/:id"
              element={
                <AdminProtectedRoute>
                  <OrderDetailsAdmin />
                </AdminProtectedRoute>
              }
            />

            {/* BOR KEZELÉS */}
            <Route
              path="/add"
              element={
                <AdminProtectedRoute>
                  <AddBor />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/manage"
              element={
                <AdminProtectedRoute>
                  <ManageBor />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/bor/:id"
              element={
                <AdminProtectedRoute>
                  <BorReszletek />
                </AdminProtectedRoute>
              }
            />

          </Routes>
        </Container>
      </Router>
    </AdminAuthProvider>
  );
}
