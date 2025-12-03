import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer
      style={{
        background: "#222",
        color: "white",
        padding: "25px 0",
        marginTop: "50px",
        textAlign: "center",
      }}
    >
      <Container>
        <h5>Bor Webshop</h5>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} - Minden jog fenntartva.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
