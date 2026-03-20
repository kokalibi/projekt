import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        background: "#222",
        color: "white",
        padding: "25px 0",
        textAlign: "center",
        width: "100%"
      }}
    >
      <Container>
        <h5>DrágaBorok</h5>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} - Minden jog fenntartva.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;