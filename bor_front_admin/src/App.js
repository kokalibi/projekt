import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import AppNavbar from "./components/Navbar";
import Home from "./pages/Home";
import AddBor from "./pages/AddBor";
import ManageBor from "./pages/ManageBor";
import BorReszletek from "./pages/BorReszletek";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddBor />} />
          <Route path="/manage" element={<ManageBor />} />
          <Route path="/bor/:id" element={<BorReszletek />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
