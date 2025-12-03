import React, { useEffect, useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Home() {
  const [borok, setBorok] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/borok").then((res) => setBorok(res.data));
  }, []);

  return (
    <Container className="mt-4">

      <h2 className="mb-4 text-center">Kiemelt borok</h2>

      <Carousel interval={3500}>
        {borok.map((b) => {
          const imageUrl = `http://localhost:8080/uploads/kep/${b.bor_id}.jpg`;

          return (
            <Carousel.Item
              key={b.bor_id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/bor/${b.bor_id}`)}
            >
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: "100%",
                  height: "400px",
                  background: "#fff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  padding: "20px",
                }}
              >
                <img
                  src={imageUrl}
                  alt={b.nev}
                  onError={(e) => (e.target.src = "/easter egg3.jpg")}
                  className="img-fluid"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <Carousel.Caption
                className="d-none d-md-block"
                style={{
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <h4>{b.nev}</h4>
                <p>{b.pince_nev}</p>
              </Carousel.Caption>

            </Carousel.Item>
          );
        })}
      </Carousel>

    </Container>
  );
}
