import { useEffect, useState, useRef, useCallback } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import API from "../api";
import WineCard from "../components/WineCard";

function WineList() {
  const [borok, setBorok] = useState([]);
  const [visible, setVisible] = useState(30);
  const loaderRef = useRef(null);

  // Szűrők
  const [search, setSearch] = useState("");
  const [tipus, setTipus] = useState("");
  const [fajta, setFajta] = useState("");
  const [pince, setPince] = useState("");
  const [evjarat, setEvjarat] = useState("");

  // Segédállapot a dropdownok feltöltéséhez (ezt csak egyszer töltjük le szűretlenül)
  const [filterOptions, setFilterOptions] = useState({ tipusok: [], fajtak: [], pincek: [], evjaratok: [] });

  // Dropdownok feltöltése kezdetkor
  useEffect(() => {
    API.get("/borok").then((res) => {
      setFilterOptions({
        tipusok: [...new Set(res.data.map(b => b.tipus_nev))],
        fajtak: [...new Set(res.data.map(b => b.fajta_nev))],
        pincek: [...new Set(res.data.map(b => b.pince_nev))],
        evjaratok: [...new Set(res.data.map(b => b.evjarat))]
      });
    });
  }, []);

  // Backend szűrés meghívása
  useEffect(() => {
    const params = { search, tipus, fajta, pince, evjarat };
    
    // API hívás query string-gel: pl. /borok?search=valami&tipus=vörös
    API.get("/borok", { params }).then((res) => {
      setBorok(res.data);
      setVisible(30);
    });
  }, [search, tipus, fajta, pince, evjarat]);

  // Infinite scroll logic (marad az eredeti, de a 'borok' hosszát nézi)
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
        <Col md={3}><Form.Control placeholder="Keresés..." value={search} onChange={e => setSearch(e.target.value)} /></Col>
        <Col md={3}>
          <Form.Select value={tipus} onChange={e => setTipus(e.target.value)}>
            <option value="">Összes típus</option>
            {filterOptions.tipusok.map(t => <option key={t}>{t}</option>)}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={fajta} onChange={e => setFajta(e.target.value)}>
            <option value="">Összes fajta</option>
            {filterOptions.fajtak.map(f => <option key={f}>{f}</option>)}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={pince} onChange={e => setPince(e.target.value)}>
            <option value="">Összes pince</option>
            {filterOptions.pincek.map(p => <option key={p}>{p}</option>)}
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {borok.slice(0, visible).map((bor) => (
          <Col key={bor.bor_id} md={4} className="mb-4"><WineCard bor={bor} /></Col>
        ))}
      </Row>
      <div ref={loaderRef} style={{ height: "50px" }} />
    </Container>
  );
}
export default WineList;