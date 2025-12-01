import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function NavbarMenu() {
  const { cart } = useCart();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Bor Webshop</Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to="/borok">Borok</Nav.Link>
          <Nav.Link as={Link} to="/checkout">
            Kosár <Badge bg="info">{cart.length}</Badge>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
export default NavbarMenu;
