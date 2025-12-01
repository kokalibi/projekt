import { useEffect, useState } from "react";
import API from "../api";
import { Container, Row, Col } from "react-bootstrap";
import WineCard from "../components/WineCard";

function WineList() {
  const [borok, setBorok] = useState([]);

  useEffect(() => {
    API.get("/borok").then((res) => setBorok(res.data));
  }, []);

  return (
    <Container>
      <Row className="g-3">
        {borok.map((b) => (
          <Col md={4} lg={3} key={b.bor_id}>
            <WineCard bor={b} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default WineList;
