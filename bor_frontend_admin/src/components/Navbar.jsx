import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useLocation } from "react-router-dom";
import socket from "../socket";

export default function AppNavbar() {
  const [totalUnread, setTotalUnread] = useState(0);
  const location = useLocation();

  useEffect(() => {
    socket.connect();
    const handleNotify = () => {
      // Csak akkor növeljük, ha nem a chat oldalon vagyunk éppen
      if (location.pathname !== "/chat") {
        setTotalUnread(prev => prev + 1);
      }
    };
    socket.on("admin_notification", handleNotify);
    return () => socket.off("admin_notification", handleNotify);
  }, [location.pathname]);

  // Ha belépünk a chatre, eltűnik a piros szám a menüből
  useEffect(() => {
    if (location.pathname === "/chat") {
      setTotalUnread(0);
    }
  }, [location.pathname]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand style={{cursor: 'pointer'}}>🍷 DrágaBorok Admin</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="admin-nav" />
        <Navbar.Collapse id="admin-nav">
          <Nav className="ms-auto align-items-center">
            <LinkContainer to="/"><Nav.Link>Rendelések</Nav.Link></LinkContainer>
            <LinkContainer to="/add"><Nav.Link>Új bor</Nav.Link></LinkContainer>
            <LinkContainer to="/manage"><Nav.Link>Kezelés</Nav.Link></LinkContainer>
            <LinkContainer to="/chat" className="position-relative">
              <Nav.Link>
                Üzenetek
                {totalUnread > 0 && (
                  <Badge pill bg="danger" style={{ position: "absolute", top: "0", right: "0", fontSize: "0.7rem" }}>
                    {totalUnread}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}