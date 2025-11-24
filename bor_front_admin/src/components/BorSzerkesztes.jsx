import React, { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

function BorSzerkesztes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bor, setBor] = useState(null);
  const [pincek, setPincek] = useState([]);
  const [fajtak, setFajtak] = useState([]);
  const [tipusok, setTipusok] = useState([]);
  const [evjaratok, setEvjaratok] = useState([]);

  const loadData = async () => {
    const b = await API.get(`/borok/${id}`);
    setBor(b.data);

    const p = await API.get("/adat/pincek");
    const f = await API.get("/adat/fajtak");
    const t = await API.get("/adat/tipusok");
    const e = await API.get("/adat/evjaratok");

    setPincek(p.data);
    setFajtak(f.data);
    setTipusok(t.data);
    setEvjaratok(e.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const update = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/borok/${id}`, bor);
      alert("Sikeres módosítás!");
      navigate(`/bor/${id}`);
    } catch (err) {
      console.error(err);
      alert("Hiba történt!");
    }
  };

  if (!bor) return <div className="text-center mt-5">Betöltés...</div>;

  return (
    <Card className="p-4 shadow-lg">
      <h3 className="mb-3">Bor adatainak módosítása</h3>

      <Form onSubmit={update}>
        <Form.Group className="mb-3">
          <Form.Label>Név</Form.Label>
          <Form.Control
            value={bor.nev}
            onChange={(e) => setBor({ ...bor, nev: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Évjárat</Form.Label>
          <Form.Select
            value={bor.evjarat_id}
            onChange={(e) => setBor({ ...bor, evjarat_id: e.target.value })}
          >
            {evjaratok.map((e) => (
              <option key={e.evjarat_id} value={e.evjarat_id}>
                {e.evjarat}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fajta</Form.Label>
          <Form.Select
            value={bor.fajta_id}
            onChange={(e) => setBor({ ...bor, fajta_id: e.target.value })}
          >
            {fajtak.map((f) => (
              <option key={f.fajta_id} value={f.fajta_id}>
                {f.nev}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Típus</Form.Label>
          <Form.Select
            value={bor.tipus_id}
            onChange={(e) => setBor({ ...bor, tipus_id: e.target.value })}
          >
            {tipusok.map((t) => (
              <option key={t.tipus_id} value={t.tipus_id}>
                {t.nev}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Pince</Form.Label>
          <Form.Select
            value={bor.pince_id}
            onChange={(e) => setBor({ ...bor, pince_id: e.target.value })}
          >
            {pincek.map((p) => (
              <option key={p.pince_id} value={p.pince_id}>
                {p.nev}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Alkohol %</Form.Label>
          <Form.Control
            value={bor.alkohol_fok}
            type="number"
            step="0.1"
            onChange={(e) =>
              setBor({ ...bor, alkohol_fok: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ár (Ft)</Form.Label>
          <Form.Control
            type="number"
            value={bor.ar}
            onChange={(e) => setBor({ ...bor, ar: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Leírás</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={bor.leiras}
            onChange={(e) => setBor({ ...bor, leiras: e.target.value })}
          />
        </Form.Group>

        <Button type="submit" variant="success">
          Mentés
        </Button>
      </Form>
    </Card>
  );
}

export default BorSzerkesztes;
