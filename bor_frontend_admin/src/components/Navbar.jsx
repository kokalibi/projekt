import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand><LinkContainer to="/"><Nav.Link>🍷DrágaBorok Admin</Nav.Link></LinkContainer></Navbar.Brand>
        
        <Nav className="me-auto">
          <LinkContainer to="/"><Nav.Link>Rendelés kezelés</Nav.Link></LinkContainer>
          <LinkContainer to="/add"><Nav.Link>Új bor hozzáadása</Nav.Link></LinkContainer>
          <LinkContainer to="/manage"><Nav.Link>Borok kezelése</Nav.Link></LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
}
