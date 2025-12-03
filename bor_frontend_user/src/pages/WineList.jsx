import { useEffect, useState } from "react";
import API from "../api";
import { Container, Row, Col } from "react-bootstrap";
import WineCard from "../components/WineCard";
import { useInView } from "react-intersection-observer";

function WineList() {
  const [borok, setBorok] = useState([]);       // teljes lista
  const [visible, setVisible] = useState(30);   // ennyit mutatunk elsőre

  // observer a lap alján levő "sentinel"-re
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    API.get("/borok").then((res) => {
      setBorok(res.data);
    });
  }, []);

  // amikor az elem láthatóvá válik → betölt +30-at
  useEffect(() => {
    if (inView && visible < borok.length) {
      setVisible((prev) => prev + 30);
    }
  }, [inView, borok.length, visible]);

  return (
    <Container className="mt-4">
      <Row className="g-3">
        {borok.slice(0, visible).map((b) => (
          <Col xs={12} sm={6} md={4} lg={3} key={b.bor_id}>
            <WineCard bor={b} />
          </Col>
        ))}
      </Row>

      {/* "sentinel" div — amikor látható, tölt még 30-at */}
      <div ref={ref} style={{ height: "50px" }}></div>
    </Container>
  );
}

export default WineList;
