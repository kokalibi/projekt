import { useEffect, useState, useRef, useCallback } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import API from "../api";
import WineCard from "../components/WineCard";

function WineList() {
  const [borok, setBorok] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [visible, setVisible] = useState(30); // egyszerre ennyit mutat
  const loaderRef = useRef(null);

  // szűrők állapota
  const [search, setSearch] = useState("");
  const [tipus, setTipus] = useState("");
  const [fajta, setFajta] = useState("");
  const [pince, setPince] = useState("");
  const [evjarat, setEvjarat] = useState("");

  // borok betöltése
  useEffect(() => {
    API.get("/borok").then((res) => {
      setBorok(res.data);
      setFiltered(res.data);
    });
  }, []);

  // szűrés
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
    setVisible(30); // szűrésnél visszaállítjuk
  }, [search, tipus, fajta, pince, evjarat, borok]);

  // INFITE SCROLL OBSERVER
  const onIntersect = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        // ha még vannak betölthető borok
        setVisible((prev) => {
          if (prev < filtered.length) return prev + 30;
          return prev;
        });
      }
    },
    [filtered.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [onIntersect]);

  // dropdown adatok
  const tipusok = [...new Set(borok.map((b) => b.tipus_nev))];
  const fajták = [...new Set(borok.map((b) => b.fajta_nev))];
  const pincék = [...new Set(borok.map((b) => b.pince_nev))];
  const evjaratok = [...new Set(borok.map((b) => b.evjarat))];

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Borok</h2>

      {/* Szűrők */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Keresés..."
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

      {/* Borok listája */}
      <Row>
        {filtered.slice(0, visible).map((bor) => (
          <Col key={bor.bor_id} md={4} className="mb-4">
            <WineCard bor={bor} />
          </Col>
        ))}
      </Row>

      {/* Loader elem – amikor látható, továbblapoz */}
      <div
        ref={loaderRef}
        style={{ height: "50px", marginBottom: "50px" }}
      />
    </Container>
  );
}

export default WineList;
