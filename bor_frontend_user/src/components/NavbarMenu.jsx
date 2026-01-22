import { Navbar, Container, Nav, Badge, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function NavbarMenu() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profilkép elérési útja
  const profilKepUrl = user?.profil_kep 
  ? `http://localhost:8080${user.profil_kep}` 
  : "/monkeywine.jpg";

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        {/* Bal oldal */}
        <Navbar.Brand as={Link} to="/">
          🍷DrágaBorok
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

          {/* Jobb oldali auth gombok és Profil */}
          <Nav className="align-items-center">
            {user ? (
              <>
                {/* Profil link képpel és névvel */}
                <Nav.Link as={Link} to="/profil" className="d-flex align-items-center me-3">
                  <Image 
                    src={profilKepUrl} 
                    roundedCircle 
                    style={{ width: "30px", height: "30px", objectFit: "cover", marginRight: "8px" }}
                    className="border border-secondary"
                  />
                  <span className="text-white">Szia, {user.nev}!</span>
                </Nav.Link>

                <Button
                  variant="outline-light"
                  size="sm"
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
                  size="sm"
                >
                  Belépés
                </Button>

                <Button
                  as={Link}
                  to="/register"
                  variant="warning"
                  size="sm"
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