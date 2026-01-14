import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, ListGroup, Card, Form, Button } from "react-bootstrap";
import API from "../api";

export default function ChatAdmin() {
  const [partners, setPartners] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchData = useCallback(() => {
    // Partnerek frissítése
    API.get("/messages/admin/partners").then(res => setPartners(res.data)).catch(() => {});
    
    // Ha van kiválasztott user, az ő üzeneteinek frissítése
    if (selectedUser) {
      API.get(`/messages/admin/${selectedUser.user_id}`).then(res => setMessages(res.data)).catch(() => {});
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000); // 4 másodperces frissítés
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      await API.post("/messages/send", { 
        userId: selectedUser.user_id, 
        message: newMessage 
      });
      setNewMessage("");
      fetchData(); // Azonnali frissítés küldés után
    } catch (err) { console.error("Küldési hiba"); }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4} className="border-end overflow-auto" style={{ height: "75vh" }}>
          <h5>Beszélgetések</h5>
          <ListGroup>
            {partners.map(p => (
              <ListGroup.Item key={p.user_id} action onClick={() => setSelectedUser(p)} active={selectedUser?.user_id === p.user_id}>
                <strong>{p.nev}</strong>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8} className="d-flex flex-column" style={{ height: "75vh" }}>
          {selectedUser ? (
            <>
              <div className="flex-grow-1 overflow-auto p-3 bg-light border rounded mb-2">
                {messages.map((m, i) => (
                  <div key={i} className={`d-flex mb-2 ${m.sender_type === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <Card className={`p-2 ${m.sender_type === 'admin' ? 'bg-primary text-white' : 'bg-white'}`} style={{ maxWidth: "75%" }}>
                      {m.message}
                    </Card>
                  </div>
                ))}
              </div>
              <Form onSubmit={handleSend} className="d-flex gap-2">
                <Form.Control value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Válasz..." />
                <Button type="submit">Küldés</Button>
              </Form>
            </>
          ) : <div className="text-center mt-5">Válassz ki egy ügyfelet!</div>}
        </Col>
      </Row>
    </Container>
  );
}