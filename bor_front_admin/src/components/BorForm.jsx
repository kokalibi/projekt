import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import API from "../api";

function BorForm() {
  const [bor, setBor] = useState({
    nev: "",
    evjarat_id: "",
    alkohol_fok: "",
    ar: "",
    leiras: "",
    pince_id: "",
    fajta_id: "",
    tipus_id: "",
  });

  const handleChange = (e) => {
    setBor({ ...bor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/borok", bor);
      alert("Bor sikeresen hozzáadva!");
      setBor({
        nev: "",
        evjarat_id: "",
        alkohol_fok: "",
        ar: "",
        leiras: "",
        pince_id: "",
        fajta_id: "",
        tipus_id: "",
      });
    } catch (err) {
      alert("Hiba történt a hozzáadás során.");
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-success text-white fw-bold">
        Új bor hozzáadása
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Control
              name="nev"
              placeholder="Bor neve"
              value={bor.nev}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              name="evjarat_id"
              placeholder="Évjárat ID"
              value={bor.evjarat_id}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              name="alkohol_fok"
              placeholder="Alkoholfok (%)"
              value={bor.alkohol_fok}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              name="ar"
              placeholder="Ár (Ft)"
              value={bor.ar}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              name="pince_id"
              placeholder="Pince ID"
              value={bor.pince_id}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              name="fajta_id"
              placeholder="Fajta ID"
              value={bor.fajta_id}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              name="tipus_id"
              placeholder="Típus ID"
              value={bor.tipus_id}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              name="leiras"
              placeholder="Leírás"
              value={bor.leiras}
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">
            Hozzáadás
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default BorForm;
