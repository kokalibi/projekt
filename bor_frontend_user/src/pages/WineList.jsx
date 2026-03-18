import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom"; // Hook az URL paraméterekhez
import { Container, Row, Col, Form } from "react-bootstrap";
import API from "../api";
import WineCard from "../components/WineCard";

function WineList() {
  const [borok, setBorok] = useState([]);
  const [visible, setVisible] = useState(30);
  const loaderRef = useRef(null);

  // URL paraméterek kezelése
  const [searchParams, setSearchParams] = useSearchParams();

  // Értékek kinyerése az URL-ből (vagy alapértelmezett üres string)
  const search = searchParams.get("search") || "";
  const tipus = searchParams.get("tipus") || "";
  const fajta = searchParams.get("fajta") || "";
  const pince = searchParams.get("pince") || "";
  const evjarat = searchParams.get("evjarat") || "";

  const [filterOptions, setFilterOptions] = useState({ tipusok: [], fajtak: [], pincek: [], evjaratok: [] });

  // Dropdownok feltöltése kezdetkor
  useEffect(() => {
    API.get("/borok").then((res) => {
      setFilterOptions({
        tipusok: [...new Set(res.data.map(b => b.tipus_nev))].filter(Boolean),
        fajtak: [...new Set(res.data.map(b => b.fajta_nev))].filter(Boolean),
        pincek: [...new Set(res.data.map(b => b.pince_nev))].filter(Boolean),
        evjaratok: [...new Set(res.data.map(b => b.evjarat))].filter(Boolean)
      });
    });
  }, []);

  // API hívás, amikor az URL paraméterek változnak
  useEffect(() => {
    const params = { search, tipus, fajta, pince, evjarat };
    
    API.get("/borok", { params }).then((res) => {
      setBorok(res.data);
      setVisible(30);
    });
  }, [search, tipus, fajta, pince, evjarat]);

  // Segédfüggvény az URL paraméterek frissítéséhez
  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key); // Ha üres, töröljük a paramétert a tiszta URL-ért
    }
    setSearchParams(newParams);
  };

  const onIntersect = useCallback((entries) => {
    if (entries[0].isIntersecting) {
      setVisible((prev) => (prev < borok.length ? prev + 30 : prev));
    }
  }, [borok.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { threshold: 1.0 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [onIntersect]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Borok</h2>
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Control 
            placeholder="Keresés..." 
            value={search} 
            onChange={e => updateParams("search", e.target.value)} 
          />
        </Col>
        <Col md={3}>
          <Form.Select value={tipus} onChange={e => updateParams("tipus", e.target.value)}>
            <option value="">Összes típus</option>
            {filterOptions.tipusok.map(t => <option key={t}>{t}</option>)}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={fajta} onChange={e => updateParams("fajta", e.target.value)}>
            <option value="">Összes fajta</option>
            {filterOptions.fajtak.map(f => <option key={f}>{f}</option>)}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={pince} onChange={e => updateParams("pince", e.target.value)}>
            <option value="">Összes pince</option>
            {filterOptions.pincek.map(p => <option key={p}>{p}</option>)}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={evjarat} onChange={e => updateParams("evjarat", e.target.value)}>
            <option value="">Összes évjárat</option>
            {filterOptions.evjaratok.map(ev => <option key={ev}>{ev}</option>)}
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {borok.slice(0, visible).map((bor) => (
          <Col key={bor.bor_id} md={4} className="mb-4"><WineCard bor={bor} /></Col>
        ))}
        {borok.length === 0 && <Col className="text-center mt-5"><h5>Nincs a keresésnek megfelelő találat.</h5></Col>}
      </Row>
      <div ref={loaderRef} style={{ height: "50px" }} />
    </Container>
  );
}
export default WineList;