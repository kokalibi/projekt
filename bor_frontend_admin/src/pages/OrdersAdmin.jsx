import { useEffect, useState } from "react";
import { Container, Table, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiba, setHiba] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (err) {
        setHiba("Nem sikerult betolteni a rendeleseket");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Betoltes...</p>;
  if (hiba) return <p className="text-danger">{hiba}</p>;

  return (
    <Container>
      <h2 className="mb-4">Rendelesek kezelese</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Datum</th>
            <th>Vevő</th>
            <th>Osszeg</th>
            <th>Statusz</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
  {orders.map(o => (
    <tr key={o.id}>
      <td>{o.id}</td>

      <td>
        {o.letrehozva
          ? new Date(o.letrehozva).toLocaleDateString()
          : "-"}
      </td>

      <td>Vendég</td>

      <td>{o.vegosszeg} Ft</td>

      <td>
        <Badge bg="info">
          {o.statusz_nev}
        </Badge>
      </td>

      <td>
        <Button
          size="sm"
          variant="primary"
          onClick={() => navigate(`/orders/${o.id}`)}
        >
          Részletek
        </Button>
      </td>
    </tr>
  ))}
</tbody>


      </Table>
    </Container>
  );
}
