import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import API from "../api";

function Szurok({ onResults }) {
  const [pincek, setPincek] = useState([]);
  const [fajtak, setFajtak] = useState([]);
  const [tipusok, setTipusok] = useState([]);
  const [evjaratok, setEvjaratok] = useState([]);

  const [pince, setPince] = useState("");
  const [fajta, setFajta] = useState("");
  const [tipus, setTipus] = useState("");
  const [evjarat, setEvjarat] = useState("");

  useEffect(() => {
    const load = async () => {
      const [p, f, t, e] = await Promise.all([
        API.get("/adat/pincek"),
        API.get("/adat/fajtak"),
        API.get("/adat/tipusok"),
        API.get("/adat/evjaratok"),
      ]);

      setPincek(p.data);
      setFajtak(f.data);
      setTipusok(t.data);
      setEvjaratok(e.data);
    };
    load();
  }, []);

  const search = async () => {
    const params = {};

    if (pince) params.pince = pince;
    if (fajta) params.fajta = fajta;
    if (tipus) params.tipus = tipus;
    if (evjarat) params.evjarat = evjarat;

    const res = await API.get("/borok/szures", { params });
    onResults(res.data);
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Header className="bg-primary text-white">Szűrés</Card.Header>
      <Card.Body>
        <Row className="g-2">

          <Col md={3}>
            <Form.Select value={pince} onChange={(e) => setPince(e.target.value)}>
              <option value="">Összes pince</option>
              {pincek.map(p => (
                <option key={p.pince_id} value={p.nev}>{p.nev}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select value={fajta} onChange={(e) => setFajta(e.target.value)}>
              <option value="">Összes fajta</option>
              {fajtak.map(f => (
                <option key={f.fajta_id} value={f.nev}>{f.nev}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select value={tipus} onChange={(e) => setTipus(e.target.value)}>
              <option value="">Összes típus</option>
              {tipusok.map(t => (
                <option key={t.tipus_id} value={t.nev}>{t.nev}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select value={evjarat} onChange={(e) => setEvjarat(e.target.value)}>
              <option value="">Összes évjárat</option>
              {evjaratok.map(e => (
                <option key={e.evjarat_id} value={e.evjarat}>{e.evjarat}</option>
              ))}
            </Form.Select>
          </Col>

        </Row>

        <div className="text-end mt-3">
          <Button onClick={search} variant="primary">Szűrés</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

//pagination

export default Szurok;
