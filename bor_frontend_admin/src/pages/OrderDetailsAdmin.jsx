import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Table, Button, Badge } from "react-bootstrap";
import API from "../api";

export default function OrderDetailsAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiba, setHiba] = useState("");

  /* =======================
     ADATOK BETÖLTÉSE
  ======================= */
  useEffect(() => {
    const load = async () => {
      try {
        const [orderRes, itemsRes] = await Promise.all([
          API.get(`/orders/${id}`),
          API.get(`/order-items/${id}`)
        ]);

        setOrder(orderRes.data);
        setItems(itemsRes.data);
      } catch (err) {
        console.error(err);
        setHiba("Nem sikerült betölteni a rendelést");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* =======================
     STÁTUSZ FRISSÍTÉS
  ======================= */
  const updateStatus = async (statusz_id) => {
    try {
      await API.put(`/orders/${id}/status`, {
        statusz_id
      });

      // újratöltjük a rendelést
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      alert("Hiba a státusz frissítéskor");
    }
  };

  if (loading) return <p>Betöltés...</p>;
  if (hiba) return <p className="text-danger">{hiba}</p>;
  if (!order) return null;

  /* =======================
     RENDER
  ======================= */
  return (
    <Container>
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        ← Vissza
      </Button>

      <h2>Rendelés #{order.id}</h2>

      <p>
        <strong>Dátum:</strong>{" "}
        {order.letrehozva
          ? new Date(order.letrehozva).toLocaleString()
          : "-"}
      </p>

      <p>
        <strong>Összeg:</strong> {order.vegosszeg} Ft
      </p>

      <p>
        <strong>Státusz:</strong>{" "}
        <Badge bg="secondary">
          {order.statusz_nev || "ismeretlen"}
        </Badge>
      </p>

      {/* ===== STÁTUSZ GOMBOK ===== */}
      <div className="mb-4 d-flex gap-2">
        <Button size="sm" onClick={() => updateStatus(1)}>
          Új
        </Button>
        <Button size="sm" onClick={() => updateStatus(2)}>
          Feldolgozás alatt
        </Button>
        <Button size="sm" onClick={() => updateStatus(3)}>
          Szállítva
        </Button>
        <Button size="sm" variant="success" onClick={() => updateStatus(4)}>
          Teljesítve
        </Button>
      </div>

      {/* ===== TÉTELEK ===== */}
      <h4>Tételek</h4>

      <Table bordered striped>
        <thead>
          <tr>
            <th>Bor</th>
            <th>Egységár</th>
            <th>Mennyiség</th>
            <th>Összesen</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.bor_nev}</td>
              <td>{item.egysegar} Ft</td>
              <td>{item.mennyiseg}</td>
              <td>{item.egysegar * item.mennyiseg} Ft</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
