import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
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

  if (!bor) return <div>Betöltés...</div>;

  return (
    <Container className="mt-4">
      <h1>{bor.nev}</h1>
      <p>
        {bor.pince_nev} – {bor.tipus_nev}
      </p>

      <img
        src={`${API_BASE}/uploads/kep/${bor.bor_id}.jpg`}
        style={{ width: "100%", maxWidth: 500 }}
        onError={(e) => (e.target.src = "/placeholder-wine.png")}
      />

      <h3 className="mt-3">{bor.ar} Ft</h3>

      <Button
        onClick={() => addToCart(bor)}
        className="mt-3"
        variant="primary"
      >
        Kosárba
      </Button>
    </Container>
  );
}
export default WineDetails;
