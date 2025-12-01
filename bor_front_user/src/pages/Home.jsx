import { Carousel, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import API from "../api";

function Home() {
  const [kiemelt, setKiemelt] = useState([]);

  useEffect(() => {
    API.get("/borok").then((res) => {
      setKiemelt(res.data.slice(0, 4)); // első 4 bor
    });
  }, []);

  return (
    <Container>
      <Carousel>
        {kiemelt.map((bor) => (
          <Carousel.Item key={bor.bor_id}>
            <img
              className="d-block w-100"
              src={`http://localhost:8080/uploads/kep/${bor.bor_id}.jpg`}
              alt={bor.nev}
              onError={(e) => (e.target.src = "/placeholder-wine.png")}
              style={{ height: 450, objectFit: "cover" }}
            />
            <Carousel.Caption>
              <h3>{bor.nev}</h3>
              <p>{bor.pince_nev}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
}
export default Home;
