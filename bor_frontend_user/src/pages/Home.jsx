import { Carousel, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // <-- EZ ÚJ
import API from "../api";
import WineCard from "../components/WineCard";
import "../home.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function Home() {
  const [kiemelt, setKiemelt] = useState([]);
  const [ajanlott, setAjanlott] = useState([]);

  const navigate = useNavigate();   // <-- NAVIGÁLÁSHOZ

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
    <Container className="mt-4">

      <Carousel>
        {kiemelt.map((bor) => (
          <Carousel.Item
            key={bor.bor_id}
            onClick={() => goToDetails(bor.bor_id)}   // <-- KATTINTÁS
            style={{ cursor: "pointer" }}            // <-- KÉZ IKON
          >
            <img
              className="d-block w-100"
              src={`${API_BASE}/uploads/kep/${bor.bor_id}.jpg`}
              alt={bor.nev}
              onError={(e) => (e.target.src = "/placeholder-wine.png")}
            />
            <Carousel.Caption>
              <h3>{bor.nev}</h3>
              <p>{bor.pince_nev}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>


      {/* Ajánlott borok */}
      <div className="home-recommend">
        <h2 className="mt-5 mb-3 text-center">Ajánlott borok</h2>
        <Row className="g-3">
          {ajanlott.map((bor) => (
            <Col md={4} lg={3} key={bor.bor_id}>
              <WineCard bor={bor} />
            </Col>
          ))}
        </Row>
      </div>

    </Container>
  );
}

export default Home;
