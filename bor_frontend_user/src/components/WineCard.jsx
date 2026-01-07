import { Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function WineCard({ bor }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const imageUrl = `${API_BASE}/uploads/kep/${bor.bor_id}.jpg`;

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
          background: "#f8f9fa",
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

      <Card.Body>
        <Card.Title>{bor.nev}</Card.Title>
        <p>{bor.pince_nev}</p>
        <strong>{bor.ar} Ft</strong>

        <div className="mt-2 d-flex gap-2">
          <Button as={Link} to={`/bor/${bor.bor_id}`} variant="secondary">
            Részletek
          </Button>

          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                bor_id: bor.bor_id,
                nev: bor.nev,
                ar: Number(bor.ar)
              });
            }}
          >
            Kosárba
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default WineCard;
