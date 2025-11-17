import React from "react";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api";

function BorCard({ bor, onDeleted }) {
  const navigate = useNavigate();

  const imageUrl = `${process.env.REACT_APP_API_BASE || "http://localhost:8080"}/uploads/kep/${bor.bor_id}.jpg`;

  const deleteBor = async (e) => {
    e.stopPropagation(); // hogy kattintáskor ne nyissa meg a részletező oldalt

    if (!window.confirm("Biztosan törlöd ezt a bort?")) return;

    try {
      await API.delete(`/borok/${bor.bor_id}`);
      onDeleted && onDeleted();
    } catch (err) {
      console.error("Törlési hiba:", err);
      alert("Hiba történt a törlés során.");
    }
  };

  return (
    <Card
      className="h-100 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/bor/${bor.bor_id}`)}
    >

      <div
        style={{
          height: 220,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa"
        }}
      >
        <img
          src={imageUrl}
          alt={bor.nev}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/easter egg3.jpg"; 
          }}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "cover" }}
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-1">{bor.nev}</Card.Title>

        <div className="mb-1 text-muted small">
          <strong>Pince:</strong> {bor.pince_nev} <br />
          <strong>Fajta:</strong> {bor.fajta_nev}
        </div>

        <div className="mb-2">
          <Badge bg="secondary" className="me-2">{bor.evjarat}</Badge>
          <Badge bg="info" className="me-2">{bor.alkohol_fok}%</Badge>
          <Badge bg="success">{bor.ar} Ft</Badge>
        </div>

        <Card.Text className="text-truncate" style={{ flex: 1 }}>
          {bor.leiras || "Nincs leírás"}
        </Card.Text>


        <div className="d-flex justify-content-between mt-3">
          <Button
            variant="danger"
            size="sm"
            onClick={deleteBor}
          >
            Törlés
          </Button>

          <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/bor/${bor.bor_id}`);
            }}
          >
            Részletek
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default function BorCards({ borok, onRefresh }) {
  if (!borok || borok.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        Nincs megjeleníthető bor.
      </div>
    );
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-3">
      {borok.map((b) => (
        <Col key={b.bor_id}>
          <BorCard bor={b} onDeleted={onRefresh} />
        </Col>
      ))}
    </Row>
  );
}
