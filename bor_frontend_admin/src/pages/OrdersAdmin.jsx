import { useEffect, useState, useCallback } from "react";
import { Container, Table, Badge, Button, Form, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiba, setHiba] = useState("");
  
  const [filters, setFilters] = useState({
    id: "",
    vevo: "",
    datum: "",
    fizetes: ""
  });

  const navigate = useNavigate();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.id) params.append("id", filters.id);
      if (filters.vevo) params.append("vevo", filters.vevo);
      if (filters.datum) params.append("datum", filters.datum);
      if (filters.fizetes) params.append("fizetes", filters.fizetes);

      const res = await API.get(`/orders?${params.toString()}`);
      setOrders(res.data);
    } catch (err) {
      setHiba("Nem sikerült betölteni a rendeléseket");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 400);
    return () => clearTimeout(timer);
  }, [loadOrders]);

  const handleDelete = async (id) => {
    if (window.confirm(`Biztosan törölni akarod a #${id} rendelést?`)) {
      try {
        await API.delete(`/orders/${id}`);
        setOrders(prev => prev.filter(o => o.id !== id));
      } catch (err) {
        alert("Hiba történt a törlés során.");
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ id: "", vevo: "", datum: "", fizetes: "" });
  };

  if (hiba) return <Container className="py-4"><p className="text-danger">{hiba}</p></Container>;

  return (
    <Container className="py-4 px-2 px-md-4">
      {/* Címsor reszponzív tördeléssel */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <h2 className="fw-bold m-0">Rendelések kezelése</h2>
        <Badge bg="dark" className="p-2 align-self-start align-self-sm-center">
          Találatok: {orders.length}
        </Badge>
      </div>

      {/* Szűrő Panel - Col méretek finomítva minden eszközre */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="bg-light rounded">
          <Form>
            <Row className="g-3">
              <Col xs={6} md={2}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Rendelés ID</Form.Label>
                  <Form.Control size="sm" name="id" value={filters.id} onChange={handleFilterChange} placeholder="ID..." />
                </Form.Group>
              </Col>
              <Col xs={6} md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Vevő neve</Form.Label>
                  <Form.Control size="sm" name="vevo" value={filters.vevo} onChange={handleFilterChange} placeholder="Keresés..." />
                </Form.Group>
              </Col>
              <Col xs={6} md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Dátum</Form.Label>
                  <Form.Control size="sm" name="datum" value={filters.datum} onChange={handleFilterChange} placeholder="YYYY-MM" />
                </Form.Group>
              </Col>
              <Col xs={6} md={2}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Fizetés</Form.Label>
                  <Form.Control size="sm" name="fizetes" value={filters.fizetes} onChange={handleFilterChange} placeholder="Mód..." />
                </Form.Group>
              </Col>
              <Col xs={12} md={2} className="d-flex align-items-end">
                <Button variant="outline-secondary" size="sm" className="w-100" onClick={resetFilters}>
                  Alaphelyzet
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Reszponzív táblázat konténer */}
      <div className="table-responsive shadow-sm rounded">
        <Table striped bordered hover className="mb-0 bg-white">
          <thead className="table-dark text-center">
            <tr className="text-nowrap">
              <th>ID</th>
              <th>Dátum</th>
              <th>Vevő</th>
              <th className="text-end">Összeg</th>
              <th>Fizetés</th>
              <th>Státusz</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody className="align-middle text-center">
            {loading ? (
              <tr><td colSpan="7" className="py-4">Betöltés...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="7" className="py-4 text-muted">Nincs találat.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td className="fw-bold">#{o.id}</td>
                  <td className="text-nowrap">
                    {o.letrehozva ? new Date(o.letrehozva).toLocaleDateString() : "-"}
                  </td>
                  <td className="text-start text-nowrap" style={{ minWidth: "150px" }}>
                    {o.vevo_nev || "Vendég"}
                  </td>
                  <td className="text-end fw-bold text-nowrap">
                    {Number(o.vegosszeg).toLocaleString()} Ft
                  </td>
                  <td>
                    <Badge bg="light" text="dark" className="border text-nowrap">
                      {o.fizetesi_mod || "Nincs adat"}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={o.statusz_id === 4 ? "success" : "primary"} className="text-nowrap">
                      {o.statusz_nev || "ismeretlen"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button variant="primary" size="sm" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                        Részletek
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(o.id)}>
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}