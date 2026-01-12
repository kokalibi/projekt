import { useEffect, useState, useCallback, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function UserChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef();

  const fetchChat = useCallback(() => {
    if (user && isOpen) {
      API.get("/messages/my-chat").then(res => setMessages(res.data)).catch(() => {});
    }
  }, [user, isOpen]);

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 4000);
    return () => clearInterval(interval);
  }, [fetchChat]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await API.post("/messages/send", { message: text });
      setText("");
      fetchChat();
    } catch (err) { console.error("Küldési hiba"); }
  };

  if (!user) return null;

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      {isOpen ? (
        <Card className="shadow" style={{ width: "320px" }}>
          <Card.Header className="bg-dark text-white d-flex justify-content-between">
            Sommelier Segítség <Button size="sm" variant="outline-light" onClick={() => setIsOpen(false)}>X</Button>
          </Card.Header>
          <Card.Body style={{ height: "300px", overflowY: "auto" }}>
            {messages.map((m, i) => (
              <div key={i} className={`mb-2 ${m.sender_type === 'user' ? 'text-end' : 'text-start'}`}>
                <span className={`p-2 rounded d-inline-block ${m.sender_type === 'user' ? 'bg-primary text-white' : 'bg-light border'}`}>
                  {m.message}
                </span>
              </div>
            ))}
            <div ref={scrollRef} />
          </Card.Body>
          <Form onSubmit={send} className="p-2 border-top">
            <Form.Control size="sm" value={text} onChange={e => setText(e.target.value)} placeholder="Üzenet..." />
          </Form>
        </Card>
      ) : <Button onClick={() => setIsOpen(true)} variant="dark" className="rounded-circle p-3 shadow">💬</Button>}
    </div>
  );
}