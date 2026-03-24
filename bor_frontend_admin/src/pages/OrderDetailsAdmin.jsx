import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Table, Button, Badge, Row, Col, Card, Spinner } from "react-bootstrap";
import API from "../api";

export default function OrderDetailsAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiba, setHiba] = useState("");

  // Adatok betöltése
  useEffect(() => {
    const loadData = async () => {
      try {
        const [orderRes, itemsRes] = await Promise.all([
          API.get(`/orders/${id}`),
          API.get(`/order-items/${id}`)
        ]);
        setOrder(orderRes.data);
        setItems(itemsRes.data);
      } catch (err) {
        console.error(err);
        setHiba("Nem sikerült betölteni a rendelés részleteit.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Státusz frissítése
  const updateStatus = async (statusz_id) => {
    try {
      await API.put(`/orders/${id}/status`, { statusz_id });
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      alert("Hiba a státusz módosításakor.");
    }
  };

  // --- RENDELÉS TÖRLÉSE ÉS VISSZADOBÁS ---
  const deleteOrder = async () => {
    if (window.confirm(`BIZTONSÁGI ELLENŐRZÉS: Biztosan véglegesen törölni akarod a #${id} rendelést?`)) {
      try {
        await API.delete(`/orders/${id}`); // Törlés a backendről
        alert("A rendelés sikeresen törölve lett.");
        navigate("/"); // AZONNALI VISSZADOBÁS AZ ADMIN LISTÁRA
      } catch (err) {
        console.error(err);
        alert("Hiba történt a törlés során. Ellenőrizd a szerverkapcsolatot!");
      }
    }
  };

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">Rendelés betöltése...</p>
    </Container>
  );

  if (hiba) return <Container className="py-5"><p className="text-danger">{hiba}</p></Container>;
  if (!order) return <Container className="py-5"><p>A rendelés nem található.</p></Container>;

  return (
    <Container className="py-4">
      {/* Felső vezérlő sáv */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mb-4">
        <Button variant="outline-secondary" onClick={() => navigate("/")}>
          ← Vissza a listához
        </Button>
        <Button variant="danger" className="fw-bold shadow-sm" onClick={deleteOrder}>
          🗑️ Rendelés végleges törlése
        </Button>
      </div>

      <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
        <div>
          <h2 className="mb-0 fw-bold">Rendelés #{order.id}</h2>
          <p className="text-muted mb-0">
            Dátum: {order.letrehozva ? new Date(order.letrehozva).toLocaleString('hu-HU') : "-"}
          </p>
        </div>
        <Badge bg={order.statusz_id === 4 ? "success" : "info"} className="fs-5 px-3 py-2 shadow-sm">
          {order.statusz_nev || "Új"}
        </Badge>
      </div>

      <Row className="mb-4 g-4">
        <Col lg={6}>
          <Card className="h-100 shadow-sm border-0 rounded-4">
            <Card.Header className="bg-primary text-white fw-bold py-3">💳 Pénzügyi és Szállítási adatok</Card.Header>
            <Card.Body className="p-4">
              <p><strong>Vevő:</strong> {order.szall_nev}</p>
              <p><strong>Összeg:</strong> <span className="text-primary fw-bold">{Number(order.vegosszeg).toLocaleString()} Ft</span></p>
              <p><strong>Fizetési mód:</strong> {order.fizetesi_mod_nev || "Nincs adat"}</p>
              <hr />
              <p className="mb-1"><strong>Cím:</strong></p>
              <p className="text-muted mb-0">{order.szall_irsz} {order.szall_varos}, {order.szall_utca}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="h-100 shadow-sm border-0 rounded-4">
            <Card.Header className="bg-dark text-white fw-bold py-3">⚙️ Státusz kezelése</Card.Header>
            <Card.Body className="p-4 d-flex flex-column justify-content-center">
              <p className="small text-muted mb-3">Válassz új állapotot a rendelésnek:</p>
              <div className="d-flex flex-wrap gap-2">
                <Button variant="outline-primary" onClick={() => updateStatus(1)}>Új</Button>
                <Button variant="outline-warning" onClick={() => updateStatus(2)}>Feldolgozás alatt</Button>
                <Button variant="outline-info" onClick={() => updateStatus(3)}>Szállítás alatt</Button>
                <Button variant="success" className="fw-bold" onClick={() => updateStatus(4)}>Teljesítve</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
        <Card.Header className="bg-white fw-bold py-3 border-bottom">📦 Rendelt borok</Card.Header>
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Termék</th>
                <th className="text-end">Egységár</th>
                <th className="text-center">Mennyiség</th>
                <th className="text-end pe-4">Részösszeg</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="ps-4 fw-medium">{item.bor_nev}</td>
                  <td className="text-end">{Number(item.egysegar).toLocaleString()} Ft</td>
                  <td className="text-center">{item.mennyiseg} db</td>
                  <td className="text-end pe-4 fw-bold">{(item.egysegar * item.mennyiseg).toLocaleString()} Ft</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light fw-bold border-top">
              <tr>
                <td colSpan="3" className="text-end ps-4 py-3">Mindösszesen:</td>
                <td className="text-end pe-4 py-3 text-primary fs-5">
                  {Number(order.vegosszeg).toLocaleString()} Ft
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </Card>
    </Container>
  );
}