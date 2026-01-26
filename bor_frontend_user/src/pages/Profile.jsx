import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Image, Alert, Spinner } from "react-bootstrap";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { logout, updateUser } = useAuth(); // updateUser behozva
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
      const res = await API.put("/user/update", formData);
      if (res.data.success) {
        // FRISSÍTÉS RELOAD NÉLKÜL:
        const updatedData = { 
          nev: nev, 
          profil_kep: res.data.profil_kep || userData.profil_kep 
        };
        setUserData(prev => ({ ...prev, ...updatedData }));
        updateUser(updatedData); // Ez szól a Navbarnak
        
        setMsg({ text: "Sikeres mentés!", type: "success" });
      }
    } catch (err) {
      setMsg({ text: "Hiba történt a mentéskor.", type: "danger" });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Biztosan törölni szeretnéd a fiókodat?")) {
      API.delete("/user/delete")
        .then(() => logout())
        .catch(() => setMsg({ text: "Hiba történt a törlés során.", type: "danger" }));
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <Card className="shadow border-0 rounded-4 overflow-hidden">
        <div className="bg-primary p-4 text-center text-white">
          <Image 
            src={userData?.profil_kep ? `http://localhost:8080${userData.profil_kep}?t=${new Date().getTime()}` : "/monkeywine.jpg"} 
            roundedCircle 
            className="border border-4 border-white shadow"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
            onError={(e) => { e.target.src = "/monkeywine.jpg"; }}
          />
          <h4 className="mt-3">{userData?.nev}</h4>
        </div>
        <Card.Body className="p-4">
          {msg.text && <Alert variant={msg.type} dismissible onClose={() => setMsg({text:"", type:""})}>{msg.text}</Alert>}
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Név módosítása</Form.Label>
              <Form.Control value={nev} onChange={e => setNev(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Új profilkép</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 py-2 mb-3">Változtatások mentése</Button>
            <Button variant="link" className="w-100 text-danger text-decoration-none" onClick={handleDelete}>Fiók törlése</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}