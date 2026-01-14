import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
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

  if (!bor) return <Container className="text-center mt-5">Betöltés...</Container>;

  return (
    <Container className="mt-4 mb-5">
      <Row className="g-4 align-items-center">
        <Col xs={12} md={6} className="text-center">
          <div className="p-3 bg-white border rounded shadow-sm">
            <img
              src={`${API_BASE}/uploads/kep/${bor.bor_id}.jpg`}
              alt={bor.nev}
              className="img-fluid"
              style={{ maxHeight: "500px", objectFit: "contain" }}
              onError={(e) => (e.target.src = "/easter egg3.jpg")}
            />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="ps-md-4 text-center text-md-start">
            <h2 className="display-5 fw-bold">{bor.nev}</h2>
            <h3 className="text-primary mb-4">{bor.ar} Ft</h3>
            <div className="bg-light p-3 rounded mb-4">
              <p><strong>Pince:</strong> {bor.pince_nev}</p>
              <p><strong>Fajta:</strong> {bor.fajta_nev}</p>
              <p><strong>Típus:</strong> {bor.tipus_nev}</p>
              <p><strong>Évjárat:</strong> {bor.evjarat}</p>
            </div>
            <h5>Leírás:</h5>
            <p className="lead">{bor.leiras || "Nincs leírás."}</p>
            <Button onClick={() => addToCart(bor)} className="w-100 py-3 mt-3" variant="primary" size="lg">
              Kosárba teszem
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default WineDetails;