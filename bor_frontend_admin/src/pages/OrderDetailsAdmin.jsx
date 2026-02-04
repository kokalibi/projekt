import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Table, Button, Badge, Row, Col, Card } from "react-bootstrap";
import API from "../api";

export default function OrderDetailsAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiba, setHiba] = useState("");

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

  const updateStatus = async (statusz_id) => {
    try {
      await API.put(`/orders/${id}/status`, { statusz_id });
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

  return (
    <Container className="py-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        ← Vissza
      </Button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Rendelés #{order.id}</h2>
        <Badge bg="info" className="fs-5">{order.statusz_nev || "ismeretlen"}</Badge>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-primary text-white">Rendelés adatai</Card.Header>
            <Card.Body>
              <p><strong>Dátum:</strong> {order.letrehozva ? new Date(order.letrehozva).toLocaleString() : "-"}</p>
              <p><strong>Összeg:</strong> {Number(order.vegosszeg).toLocaleString()} Ft</p>
              <p><strong>Fizetési mód:</strong> {order.fizetesi_mod_nev || "Nincs megadva"}</p>
              <p><strong>Fizetési státusz:</strong> {order.fizetesi_statusz || "-"}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-dark text-white">Státusz módosítása</Card.Header>
            <Card.Body className="d-flex flex-wrap gap-2 align-items-center">
              <Button variant="outline-primary" size="sm" onClick={() => updateStatus(1)}>Új</Button>
              <Button variant="outline-warning" size="sm" onClick={() => updateStatus(2)}>Feldolgozás alatt</Button>
              <Button variant="outline-info" size="sm" onClick={() => updateStatus(3)}>Szállítva</Button>
              <Button variant="success" size="sm" onClick={() => updateStatus(4)}>Teljesítve</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ===== CÍMEK MEGJELENÍTÉSE ===== */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>Szállítási cím</Card.Header>
            <Card.Body>
              <p className="mb-1 text-primary fw-bold">{order.szall_nev}</p>
              <p className="mb-0">{order.szall_irsz} {order.szall_varos}</p>
              <p className="mb-0">{order.szall_utca}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>Számlázási cím</Card.Header>
            <Card.Body>
              <p className="mb-1 text-primary fw-bold">{order.szaml_nev}</p>
              <p className="mb-0">{order.szaml_irsz} {order.szaml_varos}</p>
              <p className="mb-0">{order.szaml_utca}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h4>Tételek</h4>
      <Table bordered striped hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Bor</th>
            <th className="text-end">Egységár</th>
            <th className="text-center">Mennyiség</th>
            <th className="text-end">Összesen</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.bor_nev}</td>
              <td className="text-end">{Number(item.egysegar).toLocaleString()} Ft</td>
              <td className="text-center">{item.mennyiseg}</td>
              <td className="text-end">{(item.egysegar * item.mennyiseg).toLocaleString()} Ft</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}