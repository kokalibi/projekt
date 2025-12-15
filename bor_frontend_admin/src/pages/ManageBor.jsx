import { useEffect, useState } from "react";
import { Container, Table, Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "../api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function AdminBorok() {
  const [borok, setBorok] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [visible, setVisible] = useState([]); // <<< csak ez látszik
  const [loadIndex, setLoadIndex] = useState(30); // <<< egyszerre 30

  // szűrők
  const [search, setSearch] = useState("");
  const [tipus, setTipus] = useState("");
  const [fajta, setFajta] = useState("");
  const [pince, setPince] = useState("");
  const [evjarat, setEvjarat] = useState("");

  useEffect(() => {
    API.get("/borok").then((res) => {
      setBorok(res.data);
      setFiltered(res.data);
      setVisible(res.data.slice(0, 30)); // <<< első 30
    });
  }, []);

  // SZŰRÉS
  useEffect(() => {
    let f = borok;

    if (search.trim() !== "") {
      f = f.filter((b) =>
        b.nev.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (tipus !== "") f = f.filter((b) => b.tipus_nev === tipus);
    if (fajta !== "") f = f.filter((b) => b.fajta_nev === fajta);
    if (pince !== "") f = f.filter((b) => b.pince_nev === pince);
    if (evjarat !== "") f = f.filter((b) => String(b.evjarat) === evjarat);

    setFiltered(f);

    // ha megváltozik a szűrés → kezdjük elölről a 30-at
    setLoadIndex(30);
    setVisible(f.slice(0, 30));
  }, [search, tipus, fajta, pince, evjarat, borok]);

  // DROPDOWN ADATOK
  const tipusok = [...new Set(borok.map((b) => b.tipus_nev))];
  const fajták = [...new Set(borok.map((b) => b.fajta_nev))];
  const pincék = [...new Set(borok.map((b) => b.pince_nev))];
  const evjaratok = [...new Set(borok.map((b) => b.evjarat))];

  // TÖRLÉS
  const deleteBor = async (id) => {
    await API.delete(`/borok/${id}`);
    const newList = borok.filter((b) => b.bor_id !== id);
    setBorok(newList);
    setFiltered(newList);
    setVisible(newList.slice(0, loadIndex));
  };

  // INFINITE SCROLL
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      // közel a végéhez
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
    <Container className="mt-4">
      <h2 className="mb-4">Borok kezelése (Admin)</h2>

      {/* SZŰRŐK */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Keresés név alapján..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col md={3}>
          <Form.Select value={tipus} onChange={(e) => setTipus(e.target.value)}>
            <option value="">Összes típus</option>
            {tipusok.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select value={fajta} onChange={(e) => setFajta(e.target.value)}>
            <option value="">Összes fajta</option>
            {fajták.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select value={pince} onChange={(e) => setPince(e.target.value)}>
            <option value="">Összes pince</option>
            {pincék.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select
            value={evjarat}
            onChange={(e) => setEvjarat(e.target.value)}
          >
            <option value="">Összes évjárat</option>
            {evjaratok.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* TÁBLÁZAT */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Kép</th>
            <th>Név</th>
            <th>Típus</th>
            <th>Fajta</th>
            <th>Pince</th>
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
                <td>
                  <Link to={`/bor/${bor.bor_id}`}>
                    <img
                      src={kepUrl}
                      alt={bor.nev}
                      onError={(e) => (e.target.src = "/easter_egg3.jpg")}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "contain",
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        padding: "2px",
                        cursor: "pointer"
                      }}
                    />
                  </Link>
                </td>

                <td>{bor.nev}</td>
                <td>{bor.tipus_nev}</td>
                <td>{bor.fajta_nev}</td>
                <td>{bor.pince_nev}</td>
                <td>{bor.evjarat}</td>
                <td>{bor.ar} Ft</td>

                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteBor(bor.bor_id)}
                  >
                    Törlés
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Loading jelzés, ha még van több bor */}
      {loadIndex < filtered.length && (
        <p className="text-center mt-3 mb-5">További borok betöltése...</p>
      )}
    </Container>
  );
}

export default AdminBorok;
