import { useEffect, useState } from "react";
import { Container, Table, Button, Form, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "../api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function AdminBorok() {
  const [borok, setBorok] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loadIndex, setLoadIndex] = useState(30);

  const [search, setSearch] = useState("");
  const [tipus, setTipus] = useState("");
  const [fajta, setFajta] = useState("");
  const [pince, setPince] = useState("");
  const [evjarat, setEvjarat] = useState("");

  useEffect(() => {
    API.get("/borok").then((res) => {
      setBorok(res.data);
      setFiltered(res.data);
      setVisible(res.data.slice(0, 30));
    });
  }, []);

  useEffect(() => {
    let f = borok;
    if (search.trim() !== "") {
      f = f.filter((b) => b.nev.toLowerCase().includes(search.toLowerCase()));
    }
    if (tipus !== "") f = f.filter((b) => b.tipus_nev === tipus);
    if (fajta !== "") f = f.filter((b) => b.fajta_nev === fajta);
    if (pince !== "") f = f.filter((b) => b.pince_nev === pince);
    if (evjarat !== "") f = f.filter((b) => String(b.evjarat) === evjarat);

    setFiltered(f);
    setLoadIndex(30);
    setVisible(f.slice(0, 30));
  }, [search, tipus, fajta, pince, evjarat, borok]);

  const tipusok = [...new Set(borok.map((b) => b.tipus_nev))];
  const fajták = [...new Set(borok.map((b) => b.fajta_nev))];
  const pincék = [...new Set(borok.map((b) => b.pince_nev))];
  const evjaratok = [...new Set(borok.map((b) => b.evjarat))];

  const deleteBor = async (id) => {
    if (!window.confirm("Biztosan törölni szeretné ezt a bort?")) return;
    await API.delete(`/borok/${id}`);
    const newList = borok.filter((b) => b.bor_id !== id);
    setBorok(newList);
    setFiltered(newList);
    setVisible(newList.slice(0, loadIndex));
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      loadMore();
    }
  };

  const loadMore = () => {
    if (loadIndex >= filtered.length) return;
    const newIndex = loadIndex + 30;
    setVisible(filtered.slice(0, newIndex));
    setLoadIndex(newIndex);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center text-md-start">Borok kezelése (Admin)</h2>

      {/* SZŰRŐK SZEKCIÓ - Card-ba csomagolva a jobb mobil megjelenésért */}
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
              {tipusok.map((t) => <option key={t}>{t}</option>)}
            </Form.Select>
          </Col>
          <Col xs={6} md={2}>
            <Form.Select value={fajta} onChange={(e) => setFajta(e.target.value)}>
              <option value="">Összes fajta</option>
              {fajták.map((f) => <option key={f}>{f}</option>)}
            </Form.Select>
          </Col>
          <Col xs={6} md={2}>
            <Form.Select value={pince} onChange={(e) => setPince(e.target.value)}>
              <option value="">Összes pince</option>
              {pincék.map((p) => <option key={p}>{p}</option>)}
            </Form.Select>
          </Col>
          <Col xs={6} md={2}>
            <Form.Select value={evjarat} onChange={(e) => setEvjarat(e.target.value)}>
              <option value="">Összes évjárat</option>
              {evjaratok.map((e) => <option key={e}>{e}</option>)}
            </Form.Select>
          </Col>
        </Row>
      </Card>

      {/* TÁBLÁZAT - responsive attribútummal */}
      <div className="table-responsive shadow-sm rounded">
        <Table striped bordered hover className="align-middle mb-0 bg-white">
          <thead className="table-dark">
            <tr>
              <th>Kép</th>
              <th>Név</th>
              <th className="d-none d-lg-table-cell">Típus</th>
              <th className="d-none d-lg-table-cell">Fajta</th>
              <th className="d-none d-md-table-cell">Pince</th>
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
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "contain",
                          backgroundColor: "#fff",
                          borderRadius: "4px",
                          padding: "2px"
                        }}
                      />
                    </Link>
                  </td>
                  <td className="fw-bold">{bor.nev}</td>
                  <td className="d-none d-lg-table-cell">{bor.tipus_nev}</td>
                  <td className="d-none d-lg-table-cell">{bor.fajta_nev}</td>
                  <td className="d-none d-md-table-cell">{bor.pince_nev}</td>
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

      {loadIndex < filtered.length && (
        <div className="text-center my-4">
          <div className="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
          <span className="text-muted">További borok betöltése...</span>
        </div>
      )}
    </Container>
  );
}

export default AdminBorok;