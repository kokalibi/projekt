import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Image, Alert, Spinner } from "react-bootstrap";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { logout } = useAuth();
  const [nev, setNev] = useState("");
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    API.get("/user/me")
      .then(res => {
        setUserData(res.data);
        setNev(res.data.nev);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nev", nev);
    if (image) formData.append("image", image);

    try {
      await API.put("/user/update", formData);
      setMsg({ text: "Sikeres mentés!", type: "success" });
      // Rövid idő után frissítjük az oldalt, hogy az új kép/név betöltődjön
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMsg({ text: "Hiba történt a mentéskor.", type: "danger" });
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <Card className="shadow border-0 rounded-4 overflow-hidden">
        <div className="bg-primary p-4 text-center text-white">
          <Image 
            src={userData?.profil_kep ? `http://localhost:8080${userData.profil_kep}` : "/monkeywine.jpg"} 
            roundedCircle 
            className="border border-4 border-white shadow"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
          <h4 className="mt-3">{userData?.nev}</h4>
        </div>
        <Card.Body className="p-4">
          {msg.text && <Alert variant={msg.type}>{msg.text}</Alert>}
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Név módosítása</Form.Label>
              <Form.Control value={nev} onChange={e => setNev(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Új profilkép</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 py-2 mb-3">Változtatások mentése</Button>
            <Button variant="link" className="w-100 text-danger text-decoration-none" onClick={() => {
              if(window.confirm("Biztos törlöd magad?")) {
                API.delete("/user/delete").then(() => logout());
              }
            }}>Fiók törlése</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}