import React, { useState } from "react";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import API from "../api";

function Szurok({ onFilter }) {
  const [nev, setNev] = useState("");

  const filter = async () => {
    if (!nev) {
      onFilter();
      return;
    }
    await API.get(`/borok/nev/${nev}`);
    onFilter();
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Header className="bg-primary text-white fw-bold">Szűrés</Card.Header>
      <Card.Body>
        <InputGroup>
          <Form.Control
            placeholder="Bor neve pl. 'Tokaji'"
            value={nev}
            onChange={(e) => setNev(e.target.value)}
          />
          <Button variant="primary" onClick={filter}>
            Keresés
          </Button>
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

export default Szurok;
