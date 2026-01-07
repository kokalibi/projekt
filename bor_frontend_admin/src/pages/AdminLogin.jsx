import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import API from "../api";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hiba, setHiba] = useState("");
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/login", { email, password });

      // Elmentjük a memóriába a tokent az API kérésekhez
      window.__ADMIN_TOKEN__ = res.data.token; 

      // Beállítjuk a Context-et (ami frissítéskor törlődik)
      login(res.data, res.data.token); 
      navigate("/");
    } catch (err) {
      setHiba(err.response?.data?.error || "Hibás email vagy jelszó");
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h3>Admin bejelentkezés</h3>

      {hiba && <Alert variant="danger">{hiba}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Jelszó</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button type="submit">Belépés</Button>
    </Form>
  );
}
