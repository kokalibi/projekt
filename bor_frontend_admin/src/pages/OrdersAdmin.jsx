import { useEffect, useState, useCallback } from "react";
import { Container, Table, Badge, Button, Form, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiba, setHiba] = useState("");
  
  // Szűrők állapota
  const [filters, setFilters] = useState({
    id: "",
    vevo: "",
    datum: "",
    fizetes: ""
  });

  const navigate = useNavigate();

  // Backend szűrés meghívása
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Query string összeállítása a szűrőkből
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

  // Első betöltés és szűrő változás kezelése (debounce nélkül is azonnal lekérdez)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 400); // 400ms késleltetés, hogy gépelés közben ne küldjünk túl sok kérést

    return () => clearTimeout(timer);
  }, [loadOrders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ id: "", vevo: "", datum: "", fizetes: "" });
  };

  if (hiba) return <p className="text-danger p-4">{hiba}</p>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Rendelések kezelése</h2>
        <div className="d-flex align-items-center gap-2">
          {loading && <div className="spinner-border spinner-border-sm text-primary"></div>}
          <Badge bg="dark" className="p-2">Találatok: {orders.length}</Badge>
        </div>
      </div>

      {/* BACKEND SZŰRŐ PANEL */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="bg-light rounded">
          <Form>
            <Row className="g-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Rendelés ID</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="id"
                    placeholder="ID..."
                    value={filters.id}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Vevő neve</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="vevo"
                    placeholder="Keresés..."
                    value={filters.vevo}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Dátum töredék</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="datum"
                    placeholder="YYYY-MM"
                    value={filters.datum}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Fizetési mód</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="fizetes"
                    placeholder="Mód..."
                    value={filters.fizetes}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  className="w-100" 
                  onClick={resetFilters}
                >
                  Alaphelyzet
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Dátum</th>
            <th>Vevő</th>
            <th className="text-end">Összeg</th>
            <th>Fizetés</th>
            <th>Státusz</th>
            <th className="text-center">Művelet</th>
          </tr>
        </thead>
        <tbody>
          {!loading && orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">Nincs találat a megadott szűrők alapján.</td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.letrehozva ? new Date(o.letrehozva).toLocaleDateString() : "-"}</td>
                <td>{o.vevo_nev || "Vendég"}</td>
                <td className="text-end">{Number(o.vegosszeg).toLocaleString()} Ft</td>
                <td>
                  <Badge bg="light" text="dark" className="border">
                    {o.fizetesi_mod || "Nincs adat"}
                  </Badge>
                </td>
                <td>
                  <Badge bg={o.statusz_id === 4 ? "success" : "primary"}>
                    {o.statusz_nev || "ismeretlen"}
                  </Badge>
                </td>
                <td className="text-center">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                  >
                    Részletek
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}