import { useEffect, useState, useCallback } from "react";
import { Container, Table, Button, Form, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "../api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function AdminBorok() {
  const [borok, setBorok] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loadIndex, setLoadIndex] = useState(30);

  // Szűrők állapota
  const [search, setSearch] = useState("");
  const [tipus, setTipus] = useState("");
  const [fajta, setFajta] = useState("");
  const [pince, setPince] = useState("");
  const [evjarat, setEvjarat] = useState("");

  // Dropdown opciók
  const [options, setOptions] = useState({ tipusok: [], fajtak: [], pincek: [], evjaratok: [] });

  // 1. KEZDETI ADATOK
  useEffect(() => {
    API.get("/borok").then((res) => {
      setOptions({
        tipusok: [...new Set(res.data.map((b) => b.tipus_nev))],
        fajtak: [...new Set(res.data.map((b) => b.fajta_nev))],
        pincek: [...new Set(res.data.map((b) => b.pince_nev))],
        evjaratok: [...new Set(res.data.map((b) => b.evjarat))],
      });
      setBorok(res.data);
      setVisible(res.data.slice(0, 30));
    });
  }, []);

  // 2. BACKEND SZŰRÉS (Debounce-al)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = { search, tipus, fajta, pince, evjarat };
      
      API.get("/borok", { params }).then((res) => {
        setBorok(res.data);
        setLoadIndex(30);
        setVisible(res.data.slice(0, 30));
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, tipus, fajta, pince, evjarat]);

  // 3. TÖRLÉS FUNKCIÓ
  const deleteBor = async (id) => {
    if (!window.confirm("Biztosan törölni szeretné ezt a bort?")) return;
    try {
      await API.delete(`/borok/${id}`);
      const newList = borok.filter((b) => b.bor_id !== id);
      setBorok(newList);
      setVisible(newList.slice(0, loadIndex));
    } catch (err) {
      console.error("Törlési hiba:", err);
    }
  };

  // 4. INFINITE SCROLL
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      if (loadIndex < borok.length) {
        const newIndex = loadIndex + 30;
        setVisible(borok.slice(0, newIndex));
        setLoadIndex(newIndex);
      }
    }
  }, [loadIndex, borok.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center text-md-start">Borok kezelése (Admin)</h2>

      {/* SZŰRŐK */}
      <Card className="p-3 shadow-sm mb-4 border-0 bg-light">
        <Row className="g-2">
          <Col xs={12} md={4} lg={3}>
            <Form.Control
              type="text"
              placeholder="Keresés név alapján..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col xs={6} md={2}>
            <Form.Select value={tipus} onChange={(e) => setTipus(e.target.value)}>
              <option value="">Összes típus</option>
              {options.tipusok.map((t) => <option key={t}>{t}</option>)}
            </Form.Select>
          </Col>
          <Col xs={6} md={2}>
            <Form.Select value={fajta} onChange={(e) => setFajta(e.target.value)}>
              <option value="">Összes fajta</option>
              {options.fajtak.map((f) => <option key={f}>{f}</option>)}
            </Form.Select>
          </Col>
          <Col xs={6} md={2}>
            <Form.Select value={pince} onChange={(e) => setPince(e.target.value)}>
              <option value="">Összes pince</option>
              {options.pincek.map((p) => <option key={p}>{p}</option>)}
            </Form.Select>
          </Col>
          <Col xs={6} md={2}>
            <Form.Select value={evjarat} onChange={(e) => setEvjarat(e.target.value)}>
              <option value="">Összes évjárat</option>
              {options.evjaratok.map((e) => <option key={e}>{e}</option>)}
            </Form.Select>
          </Col>
        </Row>
      </Card>

      <div className="table-responsive shadow-sm rounded">
        <Table striped bordered hover className="align-middle mb-0 bg-white">
          <thead className="table-dark">
            <tr>
              <th>Kép</th>
              <th>Név</th>
              <th className="d-none d-lg-table-cell">Típus</th>
              <th className="d-none d-md-table-cell">Pince / Elérhetőség</th>
              <th>Évjárat</th>
              <th>Ár</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((bor) => {
              const kepUrl = `${API_BASE}/uploads/kep/${bor.bor_id}.jpg`;
              return (
                <tr key={bor.bor_id}>
                  <td style={{ width: "80px" }}>
                    <Link to={`/bor/${bor.bor_id}`}>
                      <img
                        src={kepUrl}
                        alt={bor.nev}
                        onError={(e) => (e.target.src = "/easter_egg3.jpg")}
                        style={{ width: "60px", height: "60px", objectFit: "contain" }}
                      />
                    </Link>
                  </td>
                  <td className="fw-bold">{bor.nev}</td>
                  <td className="d-none d-lg-table-cell">{bor.tipus_nev}</td>
                  {/* Pince és Elérhetőségek megjelenítése */}
                  <td className="d-none d-md-table-cell">
                    <div className="fw-bold">{bor.pince_nev}</div>
                    <div className="small text-muted" style={{ fontSize: "0.85rem" }}>
                      {bor.pince_telefon && (
                        <div className="d-flex align-items-center">
                          <span className="me-1">📞</span> {bor.pince_telefon}
                        </div>
                      )}
                      {bor.pince_email && (
                        <div className="d-flex align-items-center">
                          <span className="me-1">✉️</span> {bor.pince_email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{bor.evjarat}</td>
                  <td className="text-nowrap">{bor.ar.toLocaleString()} Ft</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteBor(bor.bor_id)}
                      >
                        Törlés
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {loadIndex < borok.length && (
        <div className="text-center my-4">
          <span className="text-muted">További borok betöltése...</span>
        </div>
      )}
    </Container>
  );
}

export default AdminBorok;