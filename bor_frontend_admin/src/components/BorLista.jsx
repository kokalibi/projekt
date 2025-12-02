import React, { useEffect, useState } from "react";
import { Table, Button, Card } from "react-bootstrap";
import API from "../api";

function BorLista({ refresh }) {
  const [borok, setBorok] = useState([]);

  const getBorok = async () => {
    const res = await API.get("/borok");
    setBorok(res.data);
  };

  const deleteBor = async (id) => {
    if (window.confirm("Biztosan törlöd ezt a bort?")) {
      await API.delete(`/borok/${id}`);
      getBorok();
    }
  };

  useEffect(() => {
    getBorok();
  }, [refresh]);

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-dark text-white fw-bold">
        Borok listája
      </Card.Header>
      <Card.Body className="p-0">
        <Table striped bordered hover responsive className="mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Név</th>
              <th>Évjárat</th>
              <th>Típus</th>
              <th>Pince</th>
              <th>Ár (Ft)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {borok.map((b) => (
              <tr key={b.bor_id}>
                <td>{b.bor_id}</td>
                <td>{b.nev}</td>
                <td>{b.evjarat}</td>
                <td>{b.tipus_nev}</td>
                <td>{b.pince_nev}</td>
                <td>{b.ar}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteBor(b.bor_id)}
                  >
                    Törlés
                  </Button>
                </td>
              </tr>
            ))}
            {borok.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-3 text-muted">
                  Nincs megjeleníthető bor
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default BorLista;
