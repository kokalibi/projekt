import { useEffect, useState, useRef, useCallback } from "react";
import { Container, Row, Col, ListGroup, Card, Form, Button, Badge } from "react-bootstrap";
import API from "../api";
import socket from "../socket";

export default function ChatAdmin() {
  const [partners, setPartners] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  // 1. Partnerek betöltése: Frissíti a listát az adatbázisból
  const loadPartners = useCallback(() => {
    API.get("/messages/admin/partners")
      .then(res => setPartners(res.data))
      .catch(err => console.error("Partner lista hiba:", err));
  }, []);

  // 2. Kapcsolódás és eseményfigyelés indításkor
  useEffect(() => {
    loadPartners();
    socket.connect();

    // Ha új partner jelenik meg az adatbázisban, frissítjük a listát
    socket.on("update_partner_list", loadPartners);

    return () => {
      socket.off("update_partner_list", loadPartners);
      socket.disconnect();
    };
  }, [loadPartners]);

  // 3. Felhasználó kiválasztása: Olvasottá tétel és chat betöltése
  useEffect(() => {
    // Szigorú ellenőrzés az undefined hiba elkerülésére
    if (selectedUser && selectedUser.user_id) {
      socket.emit("join_room", selectedUser.user_id);
      
      // Üzenetek olvasottá tétele a backendben
      API.put(`/messages/read/${selectedUser.user_id}`)
        .then(() => {
          // Helyi számláló nullázása a listában a jobb UX érdekében
          setPartners(prev => prev.map(p => 
            p.user_id === selectedUser.user_id ? { ...p, unread_count: 0 } : p
          ));
        })
        .catch(err => console.error("Olvasottá tétel hiba:", err));

      // Üzenetelőzmények lekérése
      API.get(`/messages/admin/${selectedUser.user_id}`)
        .then(res => setMessages(res.data));
    }
  }, [selectedUser]);

  // 4. Valós idejű üzenetek kezelése
  useEffect(() => {
    const handleMsg = (data) => {
      if (selectedUser && data.userId === selectedUser.user_id) {
        setMessages(prev => [...prev, data]);
        // Automatikus görgetés az aljára új üzenetnél
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else if (data.sender_type === 'user') {
        // Ha mástól jön üzenet, növeljük a piros jelvényt a listában
        setPartners(prev => prev.map(p => 
          p.user_id === data.userId ? { ...p, unread_count: (p.unread_count || 0) + 1 } : p
        ));
      }
    };

    socket.on("new_message", handleMsg);
    return () => socket.off("new_message");
  }, [selectedUser]);

  // 5. Válasz küldése az admin részéről
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser?.user_id) return;
    try {
      await API.post("/messages/send", { userId: selectedUser.user_id, message: newMessage });
      setNewMessage("");
    } catch (err) { console.error("Küldési hiba:", err); }
  };

  return (
    <Container fluid className="mt-3">
      <Row className="g-3">
        {/* Bal oldal: Partner lista */}
        <Col md={4} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold">Ügyfelek</Card.Header>
            <ListGroup variant="flush">
              {partners.map((p, index) => (
                <ListGroup.Item 
                  // Biztosítjuk az egyedi kulcsot akkor is, ha az ID még nem jött meg
                  key={p.user_id ? `partner-${p.user_id}` : `temp-${index}`} 
                  action 
                  onClick={() => setSelectedUser(p)} 
                  active={selectedUser?.user_id === p.user_id}
                  className={`d-flex justify-content-between py-3 ${p.unread_count > 0 && selectedUser?.user_id !== p.user_id ? 'bg-info bg-opacity-10 fw-bold' : ''}`}
                >
                  <span className="text-truncate">{p.nev}</span>
                  {p.unread_count > 0 && <Badge pill bg="danger">{p.unread_count}</Badge>}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Jobb oldal: Chat ablak */}
        <Col md={8} lg={9}>
          <Card className="border-0 shadow-sm" style={{ height: "75vh" }}>
            {selectedUser ? (
              <>
                <Card.Header className="bg-primary text-white fw-bold">{selectedUser.nev}</Card.Header>
                <Card.Body className="overflow-auto bg-light p-3">
                  {messages.map((m, i) => (
                    <div key={`msg-${i}`} className={`d-flex mb-2 ${m.sender_type === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div className={`p-2 rounded shadow-sm ${m.sender_type === 'admin' ? 'bg-primary text-white' : 'bg-white border'}`} style={{ maxWidth: "80%" }}>
                        {m.message}
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </Card.Body>
                <Card.Footer className="bg-white">
                  <Form onSubmit={handleSend} className="d-flex gap-2">
                    <Form.Control value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Válasz írása..." />
                    <Button type="submit" variant="primary">Küldés</Button>
                  </Form>
                </Card.Footer>
              </>
            ) : (
              <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                Válassz egy partnert a beszélgetéshez!
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}