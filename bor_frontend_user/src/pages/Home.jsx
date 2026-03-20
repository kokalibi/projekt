import { Carousel, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import API from "../api";
import WineCard from "../components/WineCard";
import "../home.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function Home() {
  const [kiemelt, setKiemelt] = useState([]);
  const [ajanlott, setAjanlott] = useState([]);
  const navigate = useNavigate();

  const goToDetails = (id) => {
    navigate(`/bor/${id}`);
  };

  useEffect(() => {
    API.get("/borok").then((res) => {
      const data = res.data;
      setKiemelt(data.slice(0, 4));
      setAjanlott(data.slice(4, 8));
    });
  }, []);

  return (
    <Container fluid className="p-0 main-home-container">
      <Container className="mt-4">
        {/* indicators={false} eltünteti a csíkokat, interval={3000} az automata váltásért */}
        <Carousel 
          variant="dark" 
          indicators={false} 
          className="custom-carousel shadow-sm mb-5"
          style={{ borderRadius: "15px", overflow: "hidden", backgroundColor: "#fff" }}
        >
          {kiemelt.map((bor) => (
            <Carousel.Item
              key={bor.bor_id}
              onClick={() => goToDetails(bor.bor_id)}
              style={{ cursor: "pointer" }}
            >
              {/* Kép konténer - biztosítja, hogy a kép ne takarjon semmit */}
              <div className="d-flex justify-content-center align-items-center bg-white" style={{ height: "400px" }}>
                <img
                  src={`${API_BASE}/uploads/kep/${bor.bor_id}.jpg`}
                  alt={bor.nev}
                  style={{ maxHeight: "100%", width: "auto", objectFit: "contain" }}
                  onError={(e) => (e.target.src = "/monke wine.jpg")}
                />
              </div>

              {/* STATIKUS NÉV: Ez a kép ALATT van, így sosem lesz takarva */}
              <div className="text-center py-3 border-top bg-white">
                <h3 className="fw-bold mb-1" style={{ color: "#333" }}>{bor.nev}</h3>
                <p className="text-muted mb-0">{bor.pince_nev}</p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        <h2 className="mb-4 text-center">Ajánlott boraink</h2>
        <Row>
          {ajanlott.map((bor) => (
            <Col key={bor.bor_id} md={3} sm={6} className="mb-4">
              <WineCard bor={bor} />
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Home;