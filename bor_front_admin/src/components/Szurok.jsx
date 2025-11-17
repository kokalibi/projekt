import React, { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import API from "../api";

function Szurok({ onResults }) {
  const [nev, setNev] = useState("");
  const [tipus, setTipus] = useState("");
  const [pince, setPince] = useState("");

  const submit = async (e) => {
    e && e.preventDefault();
    try {
      // egyszerűség: ha név van → nev alapján; különben típus/pince kombináció
      if (nev) {
        const res = await API.get(`/borok/nev/${encodeURIComponent(nev)}`);
        onResults(res.data);
        return;
      }
      if (tipus) {
        const res = await API.get(`/borok/tipus/${encodeURIComponent(tipus)}`);
        onResults(res.data);
        return;
      }
      if (pince) {
        const res = await API.get(`/borok/pince/${encodeURIComponent(pince)}`);
        onResults(res.data);
        return;
      }
      // ha nincs filter → összes
      const res = await API.get("/borok");
      onResults(res.data);
    } catch (err) {
      console.error("Szűrés hiba:", err);
      onResults([]); // üres eredmény
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Header className="bg-primary text-white">Szűrés</Card.Header>
      <Card.Body>
        <Form onSubmit={submit}>
          <Row className="g-2">
            <Col md={5}>
              <Form.Control
                placeholder="Bor neve (részlet alapján)"
                value={nev}
                onChange={(e) => setNev(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                placeholder="Típus (pl. rozé)"
                value={tipus}
                onChange={(e) => setTipus(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                placeholder="Pince (pl. Gere)"
                value={pince}
                onChange={(e) => setPince(e.target.value)}
              />
            </Col>
            <Col md={1}>
              <Button type="submit" variant="primary" className="w-100">Keres</Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Szurok;
