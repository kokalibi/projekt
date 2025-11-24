import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Badge, Button, Form } from "react-bootstrap";
import API from "../api";

function BorReszletek() {
  const { id } = useParams();
  const [bor, setBor] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Legördülő listák adatai
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

  const saveChanges = async () => {
    await API.put(`/borok/${id}`, bor);
    setEditMode(false);
    alert("Sikeres módosítás!");
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!bor) return <div className="text-center mt-5">Betöltés...</div>;

  const imageUrl = `http://localhost:8080/uploads/kep/${bor.bor_id}.jpg`;

  return (
    <Card className="shadow-lg p-3">
      {/* KÉP */}
      <div
        style={{
          height: 350,
          background: "#f8f9fa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderBottom: "1px solid #ddd"
        }}
      >
        <img
          src={imageUrl}
          alt={bor.nev}
          onError={(e) => (e.target.src = "/placeholder-wine.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "10px"
          }}
        />
      </div>

      <Card.Body>
        {/* CÍM */}
        {editMode ? (
          <Form.Control
            className="fs-3 mb-3"
            value={bor.nev}
            onChange={(e) => setBor({ ...bor, nev: e.target.value })}
          />
        ) : (
          <Card.Title className="fs-2">{bor.nev}</Card.Title>
        )}

        {/* BADGE adatok */}
        <div className="mb-3">
          <Badge bg="secondary" className="me-2">{bor.evjarat}</Badge>
          <Badge bg="info" className="me-2">{bor.alkohol_fok}%</Badge>
          <Badge bg="success">{bor.ar} Ft</Badge>
        </div>

        {/* SZERKESZTHETŐ ADATOK */}
        {editMode ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Évjárat</Form.Label>
              <Form.Select
                value={bor.evjarat_id}
                onChange={(e) =>
                  setBor({ ...bor, evjarat_id: e.target.value })
                }
              >
                {evjaratok.map((e) => (
                  <option key={e.evjarat_id} value={e.evjarat_id}>
                    {e.evjarat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Típus</Form.Label>
              <Form.Select
                value={bor.tipus_id}
                onChange={(e) =>
                  setBor({ ...bor, tipus_id: e.target.value })
                }
              >
                {tipusok.map((t) => (
                  <option key={t.tipus_id} value={t.tipus_id}>
                    {t.nev}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fajta</Form.Label>
              <Form.Select
                value={bor.fajta_id}
                onChange={(e) =>
                  setBor({ ...bor, fajta_id: e.target.value })
                }
              >
                {fajtak.map((f) => (
                  <option key={f.fajta_id} value={f.fajta_id}>
                    {f.nev}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pince</Form.Label>
              <Form.Select
                value={bor.pince_id}
                onChange={(e) =>
                  setBor({ ...bor, pince_id: e.target.value })
                }
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
                type="number"
                value={bor.alkohol_fok}
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
                onChange={(e) =>
                  setBor({ ...bor, ar: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Leírás</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={bor.leiras}
                onChange={(e) =>
                  setBor({ ...bor, leiras: e.target.value })
                }
              />
            </Form.Group>
          </>
        ) : (
          <>
            <p><strong>Pince:</strong> {bor.pince_nev}</p>
            <p><strong>Típus:</strong> {bor.tipus_nev}</p>
            <p><strong>Fajta:</strong> {bor.fajta_nev}</p>
            <h5 className="mt-4">Leírás</h5>
            <p>{bor.leiras || "Nincs leírás"}</p>
          </>
        )}

        {/* GOMBOK */}
        <div className="d-flex gap-2 mt-4">
          <Link to="/manage">
            <Button variant="outline-primary">Vissza</Button>
          </Link>

          {!editMode && (
            <Button variant="warning" onClick={() => setEditMode(true)}>
              Szerkesztés
            </Button>
          )}

          {editMode && (
            <Button variant="success" onClick={saveChanges}>
              Mentés
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default BorReszletek;
