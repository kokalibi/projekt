import React, { useEffect, useState } from "react";
import API from "../api";
import DragDropImage from "../components/DragDropImage";
import { Button, Form } from "react-bootstrap";

export default function AddBor() {
  const [pincek, setPincek] = useState([]);
  const [fajtak, setFajtak] = useState([]);
  const [evjaratok, setEvjaratok] = useState([]);
  const [tipusok, setTipusok] = useState([]);
  const [kepFile, setKepFile] = useState(null);

  const [bor, setBor] = useState({
    nev: "",
    ar: "",
    alkohol_fok: "",
    leiras: "",
    pince_id: "",
    fajta_id: "",
    evjarat_id: "",
    tipus_id: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setPincek((await API.get("/adat/pincek")).data);
setFajtak((await API.get("/adat/fajtak")).data);
setEvjaratok((await API.get("/adat/evjaratok")).data);
setTipusok((await API.get("/adat/tipusok")).data);

  };

  const handleChange = (e) => {
    setBor({ ...bor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  try {
    // 1️⃣ Bor adatainak mentése
    const response = await API.post("/borok", bor);
    const newId = response.data.bor_id;

    // 2️⃣ Ha van kép → feltöltjük
    if (kepFile) {
      const formData = new FormData();
      formData.append("file", kepFile);   // <-- EZ A HELYES!

      await API.post(`/upload/${newId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    alert("Bor sikeresen hozzáadva!");
  } catch (err) {
    console.error("Hiba:", err);
    alert("Hiba történt!");
  }
};


  

  return (
    <div>
      <h3>Új bor hozzáadása</h3>

      <Form>
        <Form.Group>
          <Form.Label>Név</Form.Label>
          <Form.Control name="nev" onChange={handleChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Pincészet</Form.Label>
          <Form.Select name="pince_id" onChange={handleChange}>
            <option>Válassz...</option>
            {pincek.map(p => <option key={p.pince_id} value={p.pince_id}>{p.nev}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Fajta</Form.Label>
          <Form.Select name="fajta_id" onChange={handleChange}>
            <option>Válassz...</option>
            {fajtak.map(f => <option key={f.fajta_id} value={f.fajta_id}>{f.nev}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Típus</Form.Label>
          <Form.Select name="tipus_id" onChange={handleChange}>
            <option>Válassz...</option>
            {tipusok.map(t => <option key={t.tipus_id} value={t.tipus_id}>{t.nev}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Évjárat</Form.Label>
          <Form.Select name="evjarat_id" onChange={handleChange}>
            <option>Válassz...</option>
            {evjaratok.map(e => <option key={e.evjarat_id} value={e.evjarat_id}>{e.evjarat}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Ár (Ft)</Form.Label>
          <Form.Control name="ar" onChange={handleChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Alkohol %</Form.Label>
          <Form.Control name="alkohol_fok" onChange={handleChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Leírás</Form.Label>
          <Form.Control as="textarea" name="leiras" rows={4} onChange={handleChange} />
        </Form.Group>
      </Form>

      <h5 className="mt-4">Kép feltöltése</h5>
      <DragDropImage onFileSelected={setKepFile} />

      <Button className="mt-4" onClick={handleSubmit}>Mentés</Button>
    </div>
  );
}
