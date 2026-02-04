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
        setHiba("Nem sikerült betölteni a rendeléseket");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-4">Betöltés...</p>;
  if (hiba) return <p className="text-danger p-4">{hiba}</p>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Rendelések kezelése</h2>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Dátum</th>
            <th>Vevő</th>
            <th>Összeg</th>
            <th>Fizetés</th>
            <th>Státusz</th>
            <th className="text-center">Művelet</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.letrehozva ? new Date(o.letrehozva).toLocaleDateString() : "-"}</td>
              <td>{o.vevo_nev || "Vendég"}</td>
              <td>{Number(o.vegosszeg).toLocaleString()} Ft</td>
              <td>
                <Badge bg="light" text="dark" className="border">
                  {o.fizetesi_mod || "Nincs adat"}
                </Badge>
              </td>
              <td>
                <Badge bg={o.statusz_id === 4 ? "success" : "primary"}>
                  {o.statusz_nev || "ismeretlen"}
                </Badge>
              </td>
              <td className="text-center">
                <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => navigate(`/admin/orders/${o.id}`)} // Ennek egyeznie kell a fenti path-al!
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