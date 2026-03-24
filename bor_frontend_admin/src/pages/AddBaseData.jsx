import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Card, Alert, ListGroup } from "react-bootstrap";
import API from "../api";

export default function AddBaseData() {
  const [msg, setMsg] = useState({ type: "", text: "" });
  
  const [pincek, setPincek] = useState([]);
  const [orszagok, setOrszagok] = useState([]);
  const [fajtak, setFajtak] = useState([]);
  const [tipusok, setTipusok] = useState([]);
  const [evjaratok, setEvjaratok] = useState([]);

  // Form állapot bővítve az összes adatbázis mezővel
  const [pince, setPince] = useState({ 
    nev: "", 
    telepules: "", 
    cim: "", 
    telefon: "", 
    email: "", 
    weboldal: "", 
    orszag_id: "" 
  });
  const [ujOrszag, setUjOrszag] = useState("");
  const [fajta, setFajta] = useState({ nev: "", szin: "" });
  const [tipus, setTipus] = useState("");
  const [evjarat, setEvjarat] = useState("");

  const loadAllData = async () => {
    try {
      const [p, o, f, t, e] = await Promise.all([
        API.get("/adat/pincek"),
        API.get("/adat/orszagok"),
        API.get("/adat/fajtak"),
        API.get("/adat/tipusok"),
        API.get("/adat/evjaratok")
      ]);
      setPincek(p.data);
      setOrszagok(o.data);
      setFajtak(f.data);
      setTipusok(t.data);
      setEvjaratok(e.data);
    } catch (err) {
      console.error("Hiba az adatok betöltésekor", err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSave = async (endpoint, data, resetFn) => {
    try {
      setMsg({ type: "", text: "" });
      await API.post(`/adat/${endpoint}`, data);
      setMsg({ type: "success", text: "Sikeresen mentve az adatbázisba!" });
      resetFn();
      loadAllData();
    } catch (err) {
      setMsg({ type: "danger", text: "Hiba történt a mentés során! Ellenőrizze a mezőket." });
    }
  };

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt az elemet?")) return;
    try {
      setMsg({ type: "", text: "" });
      await API.delete(`/adat/${endpoint}/${id}`);
      setMsg({ type: "success", text: "Sikeresen törölve!" });
      loadAllData();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Hiba történt a törlés során!";
      setMsg({ type: "danger", text: errorMsg });
    }
  };

  return (
    <Container className="py-4 bg-light">
      <h2 className="mb-4 text-center fw-bold">Alapadatok Karbantartása</h2>
      {msg.text && <Alert variant={msg.type} dismissible onClose={() => setMsg({text:""})}>{msg.text}</Alert>}

      <Row>
        <Col lg={12} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white fw-bold py-3">Pincészetek Kezelése</Card.Header>
            <Card.Body>
              <Form className="mb-4 p-3 border rounded bg-white" onSubmit={(e) => { 
                e.preventDefault(); 
                handleSave("pincek", pince, () => setPince({nev:"", telepules:"", cim:"", telefon:"", email:"", weboldal:"", orszag_id:""})); 
              }}>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Label className="small fw-bold">Pince neve *</Form.Label>
                    <Form.Control value={pince.nev} onChange={e => setPince({...pince, nev: e.target.value})} required />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label className="small fw-bold">Ország *</Form.Label>
                    <Form.Select value={pince.orszag_id} onChange={e => setPince({...pince, orszag_id: e.target.value})} required>
                      <option value="">Válassz...</option>
                      {orszagok.map(o => <option key={o.orszag_id} value={o.orszag_id}>{o.nev}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label className="small fw-bold">Település *</Form.Label>
                    <Form.Control value={pince.telepules} onChange={e => setPince({...pince, telepules: e.target.value})} required />
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="small fw-bold">Pontos cím *</Form.Label>
                    <Form.Control value={pince.cim} onChange={e => setPince({...pince, cim: e.target.value})} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="small fw-bold">Telefonszám *</Form.Label>
                    <Form.Control value={pince.telefon} onChange={e => setPince({...pince, telefon: e.target.value})} required />
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="small fw-bold">E-mail cím *</Form.Label>
                    <Form.Control type="email" value={pince.email} onChange={e => setPince({...pince, email: e.target.value})} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="small fw-bold">Weboldal URL *</Form.Label>
                    <Form.Control value={pince.weboldal} onChange={e => setPince({...pince, weboldal: e.target.value})} required />
                  </Col>
                </Row>
                
                <Button variant="primary" type="submit" className="w-100 mt-2 fw-bold">Pincészet mentése</Button>
              </Form>

              <h5 className="mb-3 fw-bold">Regisztrált pincék</h5>
              <ListGroup variant="flush" className="border rounded" style={{maxHeight: '300px', overflowY: 'auto'}}>
                {pincek.map(p => (
                  <ListGroup.Item key={p.pince_id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-bold">{p.nev}</span> 
                      <small className="text-muted ms-2">({p.telepules}, {p.orszag_nev})</small>
                      <div className="small text-muted">{p.email} | {p.weboldal}</div>
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete("pincek", p.pince_id)}>Törlés</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Többi rész változatlan (Országok, Fajták, Típusok, Évjáratok) */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-warning text-dark fw-bold">Országok</Card.Header>
            <Card.Body>
              <Form className="d-flex gap-2 mb-3" onSubmit={(e) => { 
                e.preventDefault(); 
                handleSave("orszagok", {nev: ujOrszag}, () => setUjOrszag("")); 
              }}>
                <Form.Control placeholder="Új ország..." value={ujOrszag} onChange={e => setUjOrszag(e.target.value)} required />
                <Button variant="warning" type="submit">Hozzáad</Button>
              </Form>
              <ListGroup style={{maxHeight: '200px', overflowY: 'auto'}}>
                {orszagok.map(o => (
                  <ListGroup.Item key={o.orszag_id} className="d-flex justify-content-between align-items-center">
                    {o.nev}
                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete("orszagok", o.orszag_id)}>Törlés</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-success text-white fw-bold">Szőlőfajták</Card.Header>
            <Card.Body>
              <Form className="d-flex gap-2 mb-3" onSubmit={(e) => { 
                e.preventDefault(); 
                handleSave("fajtak", fajta, () => setFajta({nev:"", szin:""})); 
              }}>
                <Form.Control placeholder="Fajta..." value={fajta.nev} onChange={e => setFajta({...fajta, nev: e.target.value})} required />
                <Button variant="success" type="submit">Hozzáad</Button>
              </Form>
              <ListGroup style={{maxHeight: '200px', overflowY: 'auto'}}>
                {fajtak.map(f => (
                  <ListGroup.Item key={f.fajta_id} className="d-flex justify-content-between align-items-center">
                    {f.nev}
                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete("fajtak", f.fajta_id)}>Törlés</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-info text-white fw-bold">Bor típusok</Card.Header>
            <Card.Body>
              <Form className="d-flex gap-2 mb-3" onSubmit={(e) => { 
                e.preventDefault(); 
                handleSave("tipusok", { nev: tipus }, () => setTipus("")); 
              }}>
                <Form.Control placeholder="Típus..." value={tipus} onChange={e => setTipus(e.target.value)} required />
                <Button variant="info" type="submit" className="text-white">Hozzáad</Button>
              </Form>
              <ListGroup style={{maxHeight: '200px', overflowY: 'auto'}}>
                {tipusok.map(t => (
                  <ListGroup.Item key={t.tipus_id} className="d-flex justify-content-between align-items-center">
                    {t.nev}
                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete("tipusok", t.tipus_id)}>Törlés</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-dark text-white fw-bold">Évjáratok</Card.Header>
            <Card.Body>
              <Form className="d-flex gap-2 mb-3" onSubmit={(e) => { 
                e.preventDefault(); 
                handleSave("evjaratok", { evjarat: evjarat }, () => setEvjarat("")); 
              }}>
                <Form.Control type="number" placeholder="Év..." value={evjarat} onChange={e => setEvjarat(e.target.value)} required />
                <Button variant="dark" type="submit">Hozzáad</Button>
              </Form>
              <ListGroup style={{maxHeight: '200px', overflowY: 'auto'}}>
                {evjaratok.map(ev => (
                  <ListGroup.Item key={ev.evjarat_id} className="d-flex justify-content-between align-items-center">
                    {ev.evjarat}
                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete("evjaratok", ev.evjarat_id)}>Törlés</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}