import React, { useEffect, useState } from "react";
import { Carousel, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Home() {
  const [kiemeltBorok, setKiemeltBorok] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadBorok();
  }, []);

  const loadBorok = async () => {
    try {
      const res = await API.get("/borok");
      setKiemeltBorok(res.data.slice(0, 5));
    } catch (err) {
      console.error("Hiba a borok betöltésekor:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4 fw-bold">Kiemelt borok</h2>

      {kiemeltBorok.length > 0 && (
        <Carousel fade interval={3500}>
          {kiemeltBorok.map((bor) => (
            <Carousel.Item key={bor.bor_id}>
              <img
                className="d-block mx-auto"
                src={`http://localhost:8080/uploads/kep/${bor.bor_id}.jpg`}
                onError={(e) => (e.target.src = "/placeholder-wine.png")}
                alt={bor.nev}
                style={{
                  width: "auto",
                  maxWidth: "100%",
                  height: "450px",
                  objectFit: "contain",  
                  borderRadius: "10px"
                }}
              />


              <Carousel.Caption
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.55)",
                  borderRadius: "10px",
                  padding: "15px"
                }}
              >
                <h3 className="fw-bold">{bor.nev}</h3>
                <p className="mb-1">{bor.pince_nev}</p>
                <p className="fw-bold fs-5 text-warning">{bor.ar} Ft</p>

                <Button
                  variant="light"
                  onClick={() => navigate(`/bor/${bor.bor_id}`)}
                >
                  Részletek megtekintése
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </Container>
  );
}

export default Home;
