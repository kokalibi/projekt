import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
import API from "../api";
import { useCart } from "../context/CartContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function WineDetails() {
  const { id } = useParams();
  const [bor, setBor] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get(`/borok/${id}`).then((res) => setBor(res.data));
  }, [id]);

  if (!bor) return <div className="container mt-5">Betöltés...</div>;

  return (
    <Container className="mt-5 mb-5">
      <h2 className="text-center mb-4">{bor.nev}</h2>

      <Row className="align-items-start">

        {/* Kép blokk */}
        <Col md={6} className="d-flex justify-content-center mb-4">
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#f2f2f2",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            <img
              src={`${API_BASE}/uploads/kep/${bor.bor_id}.jpg`}
              alt={bor.nev}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "10px"
              }}
              onError={(e) => (e.target.src = "/easter egg3.jpg")}
            />
          </div>
        </Col>

        {/* Részletek blokk */}
        <Col md={6}>
          <h4 className="mb-3">Ár: {bor.ar} Ft</h4>

          <p><strong>Pince:</strong> {bor.pince_nev}</p>
          <p><strong>Fajta:</strong> {bor.fajta_nev}</p>
          <p><strong>Típus:</strong> {bor.tipus_nev}</p>
          <p><strong>Évjárat:</strong> {bor.evjarat}</p>

          <h5 className="mt-4">Leírás:</h5>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            {bor.leiras || "Nincs leírás."}
          </p>

          <Button
            onClick={() => addToCart(bor)}
            className="mt-3"
            variant="primary"
          >
            Kosárba
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default WineDetails;
