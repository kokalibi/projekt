import { Navbar, Container, Nav, Badge } from "react-bootstrap";
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
        <Navbar.Brand as={Link} to="/">Bor Webshop</Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to="/borok">Borok</Nav.Link>
          <Nav.Link as={Link} to="/checkout">
            Kosár <Badge bg="info">{cart.length}</Badge>
            {user ? (
              <>
                <span className="me-3">Szia, {user.nev}!</span>
                <button className="btn btn-outline-light"
                        onClick={() => { logout(); navigate("/"); }}>
                  Kilépés
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">Belépés</Link>
                <Link to="/register" className="btn btn-warning">Regisztráció</Link>
              </>
            )}

          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
export default NavbarMenu;
