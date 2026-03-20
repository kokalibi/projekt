import React, { useEffect, useState } from "react";
import { Container, Button, Badge, Card, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import API from "../api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/orders/my-orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Státusz színek rendelése
  const getStatusColor = (id) => {
    switch(id) {
      case 1: return "warning"; // Feldolgozás alatt
      case 2: return "info";    // Szállítás alatt
      case 3: return "success"; // Teljesítve
      default: return "secondary";
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="grow" variant="primary" /></Container>;

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Rendeléstörténet</h2>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate("/profil")}>Vissza a profilhoz</Button>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm bg-light">
          <p className="fs-5 text-muted">Még nem adtál le rendelést.</p>
          <Button variant="primary" onClick={() => navigate("/borok")}>Irány a webshop!</Button>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-4 border-0 shadow-sm overflow-hidden" style={{ borderRadius: "15px" }}>
            <div className={`p-1 bg-${getStatusColor(order.statusz_id)}`} />
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <h5 className="fw-bold m-0">#{order.id} Rendelés</h5>
                    <Badge pill bg={getStatusColor(order.statusz_id)} className="text-uppercase px-3">
                      {order.statusz_nev}
                    </Badge>
                  </div>
                  <p className="text-muted small mb-3">
                    📅 {new Date(order.letrehozva).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  
                  <div className="mb-3">
                    <div className="fw-bold small text-uppercase text-muted mb-2">Rendelt termékek:</div>
                    <ul className="list-unstyled">
                      {order.borok_raw.split('|').map((bor, idx) => (
                        <li key={idx} className="d-flex align-items-center mb-1">
                          <span className="me-2">🍷</span> {bor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
                
                <Col md={4} className="text-md-end border-start">
                  <div className="mb-3">
                    <div className="small text-muted">Fizetési mód:</div>
                    <div className="fw-bold">{order.fizetesi_mod}</div>
                  </div>
                  <div className="mb-3">
                    <div className="small text-muted">Végösszeg:</div>
                    <h4 className="fw-bold text-primary m-0">
                      {order.vegosszeg.toLocaleString()} Ft
                    </h4>
                  </div>
                  <Button 
                    variant="dark" 
                    className="w-100 rounded-pill fw-bold py-2 mt-2"
                    onClick={() => {/* handleReorder hívás */}}
                  >
                    🔄 Újrarendelés
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}