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
    /* A fluid={true} biztosítja, hogy a háttér kitöltse a teret, 
       a p-0 pedig eltünteti a belső fehér töréseket */
    <Container fluid className="p-0 main-home-container">
      <Container className="mt-4">
        {/* A variant="dark" feketére színezi a nyilakat és az indikátorokat */}
        <Carousel variant="dark" className="custom-carousel shadow-sm mb-5">
          {kiemelt.map((bor) => (
            <Carousel.Item
              key={bor.bor_id}
              onClick={() => goToDetails(bor.bor_id)}
              style={{ cursor: "pointer" }}
            >
              <img
                className="d-block w-100 carousel-img"
                src={`${API_BASE}/uploads/kep/${bor.bor_id}.jpg`}
                alt={bor.nev}
                onError={(e) => (e.target.src = "/monke wine.jpg")}
              />
              <Carousel.Caption className="custom-caption">
                <h3>{bor.nev}</h3>
                <p>{bor.pince_nev}</p>
              </Carousel.Caption>
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