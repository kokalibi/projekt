import { Navbar, Container, Nav, Badge, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function NavbarMenu() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        {/* Bal oldal */}
        <Navbar.Brand as={Link} to="/">
          Bor Webshop
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        {/* Jobb oldal */}
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/borok">Borok</Nav.Link>

            <Nav.Link as={Link} to="/checkout">
              Kosár <Badge bg="info">{cart.length}</Badge>
            </Nav.Link>
          </Nav>

          {/* Jobb oldali auth gombok */}
          <Nav>
            {user ? (
              <>
                <Nav.Item className="text-white me-3 d-flex align-items-center">
                  Szia, {user.nev}!
                </Nav.Item>

                <Button
                  variant="outline-light"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Kilépés
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  className="me-2"
                >
                  Belépés
                </Button>

                <Button
                  as={Link}
                  to="/register"
                  variant="warning"
                >
                  Regisztráció
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarMenu;
