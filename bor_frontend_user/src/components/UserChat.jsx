import { useEffect, useState, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import socket from "../socket";

export default function UserChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Alapértelmezetten zárt
  const scrollRef = useRef();

  // FIGYELÉS: Ha megváltozik a felhasználó (pl. új login), zárjuk be az ablakot
  useEffect(() => {
    setIsOpen(false);
    setMessages([]);
  }, [user?.user_id, user?.id]); // Ha az ID változik, resetelünk

  useEffect(() => {
    if (user && isOpen) {
      socket.connect();
      socket.emit("join_room", user.user_id || user.id);
      API.get("/messages/my-chat").then(res => setMessages(res.data));

      const handleMsg = (data) => {
        setMessages((prev) => [...prev, data]);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      const handleClose = () => setIsOpen(false);

      socket.on("new_message", handleMsg);
      socket.on("force_close_chat", handleClose);

      return () => {
        socket.off("new_message", handleMsg);
        socket.off("force_close_chat", handleClose);
        socket.disconnect();
      };
    }
  }, [user, isOpen]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await API.post("/messages/send", { message: text });
      setText("");
    } catch (err) { console.error("Hiba"); }
  };

  if (!user) return null;

  return (
  <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
    {isOpen ? (
      /* Hozzáadtuk a 'chat-card' osztályt */
      <Card className="chat-card shadow-lg border-0" style={{ width: "320px", maxWidth: "90vw", borderRadius: "10px", overflow: "hidden" }}>
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center border-0">
          <span>Segítség</span>
          <Button size="sm" variant="outline-light" onClick={() => setIsOpen(false)}>X</Button>
        </Card.Header>
        
        <Card.Body className="bg-light" style={{ height: "300px", overflowY: "auto", padding: "15px" }}>
          {messages.map((m, i) => (
            <div key={i} className={`mb-2 ${m.sender_type === 'user' ? 'text-end' : 'text-start'}`}>
              <span className={`p-2 px-3 rounded d-inline-block ${m.sender_type === 'user' ? 'bg-primary text-white' : 'bg-white text-dark shadow-sm'}`}>
                {m.message}
              </span>
            </div>
          ))}
          <div ref={scrollRef} />
        </Card.Body>

        <Form onSubmit={send} className="p-2 border-top bg-white">
          <Form.Control size="sm" value={text} onChange={e => setText(e.target.value)} placeholder="Írjon üzenetet..." />
        </Form>
      </Card>
    ) : (
      <Button onClick={() => setIsOpen(true)} variant="dark" className="rounded-circle p-3 shadow-lg border-0">
        💬
      </Button>
    )}
  </div>
);
}