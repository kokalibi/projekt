import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>🍷 Bor Admin</Navbar.Brand>
        <Nav className="me-auto">
          <LinkContainer to="/">
            <Nav.Link>Kezdőlap</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/add">
            <Nav.Link>Új bor hozzáadása</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/manage">
            <Nav.Link>Borok kezelése</Nav.Link>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
