import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function Profile() {
  const { logout, updateUser } = useAuth();
  const [msg, setMsg] = useState(null);
  const [formData, setFormData] = useState({
    nev: "",
    email: "",
    jelszo: "",
    cim: ""
  });

  useEffect(() => {
    API.get("/user/me").then((res) => {
      setFormData({
        nev: res.data.nev || "",
        email: res.data.email || "",
        jelszo: "", // Biztonsági okokból sosem küldjük vissza a jelszót
        cim: res.data.cim || ""
      });
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/user/update", formData);
      if (res.data.success) {
        // Frissítjük a globális AuthContext-et is az új névvel és emaillel
        updateUser({ nev: formData.nev, email: formData.email });
        setMsg({ text: "Adatok sikeresen frissítve!", type: "success" });
        setFormData(prev => ({ ...prev, jelszo: "" })); // Jelszó mező ürítése mentés után
      }
    } catch (err) {
      setMsg({ text: "Hiba történt a mentés során.", type: "danger" });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Biztosan törlöd a fiókodat?")) {
      await API.delete("/user/delete");
      logout();
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow border-0 rounded-4">
        <div className="bg-primary p-4 text-center text-white rounded-top-4">
          <div className="fs-1">⚙️</div>
          <h4 className="mt-2">Fiók beállítások</h4>
        </div>

        <Card.Body className="p-4">
          {msg && <Alert variant={msg.type}>{msg.text}</Alert>}

          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Név</Form.Label>
              <Form.Control name="nev" value={formData.nev} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email cím</Form.Label>
              <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Új jelszó</Form.Label>
              <Form.Control 
                name="jelszo" 
                type="password" 
                placeholder="Csak akkor töltsd ki, ha módosítani akarod" 
                value={formData.jelszo} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Szállítási cím</Form.Label>
              <Form.Control 
                name="cim" 
                as="textarea" 
                rows={2} 
                placeholder="Város, utca, házszám..." 
                value={formData.cim} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2 fw-bold shadow-sm">
              Módosítások mentése
            </Button>
          </Form>

          <hr className="my-4" />
          <Button variant="link" className="w-100 text-danger text-decoration-none" onClick={handleDelete}>
            Fiók végleges törlése
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}