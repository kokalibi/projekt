import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Badge, Button } from "react-bootstrap";
import API from "../api";

function BorReszletek() {
  const { id } = useParams();
  const [bor, setBor] = useState(null);

  const getBor = async () => {
    try {
      const res = await API.get(`/borok/${id}`);
      setBor(res.data);
    } catch (err) {
      console.error("Hiba a bor lekérésénél:", err);
    }
  };

  useEffect(() => {
    getBor();
  }, [id]);

  if (!bor) return <div className="text-center mt-5">Betöltés...</div>;

  const imageUrl = `http://localhost:8080/uploads/kep/${bor.bor_id}.jpg`;

  return (
    <Card className="shadow-lg">
      <div
  style={{
    height: 350,
    background: "#f8f9fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderBottom: "1px solid #ddd"
  }}
>
  <img
    src={imageUrl}
    alt={bor.nev}
    onError={(e) => (e.target.src = "/placeholder-wine.png")}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",   
      padding: "10px"
    }}
  />
</div>

      <Card.Body>
        <Card.Title className="fs-2">{bor.nev}</Card.Title>

        <div className="mb-3">
          <Badge bg="secondary" className="me-2">{bor.evjarat}</Badge>
          <Badge bg="info" className="me-2">{bor.alkohol_fok}%</Badge>
          <Badge bg="success">{bor.ar} Ft</Badge>
        </div>

        <p><strong>Pince:</strong> {bor.pince_nev}</p>
        <p><strong>Típus:</strong> {bor.tipus_nev}</p>
        <p><strong>Fajta:</strong> {bor.fajta_nev}</p>

        <h5 className="mt-4">Leírás</h5>
        <p>{bor.leiras || "Nincs leírás"}</p>

        <Link to="/manage">
          <Button variant="outline-primary">Vissza</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default BorReszletek;
