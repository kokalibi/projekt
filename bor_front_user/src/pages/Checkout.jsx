import { useCart } from "../context/CartContext";
import { Container, Button, Table, Form } from "react-bootstrap";
import { useState } from "react";
import API from "../api";

function Checkout() {
  const { cart, changeQty, removeFromCart } = useCart();
  const [user, setUser] = useState({ nev: "", cim: "", email: "" });

  const submit = async () => {
    await API.post("/orders", { user, cart });
    alert("Rendelés sikeresen elküldve!");
  };

  return (
    <Container>
      <h2>Kosár</h2>

      <Table>
        <tbody>
          {cart.map((i) => (
            <tr key={i.bor_id}>
              <td>{i.nev}</td>
              <td>
                <Form.Control
                  type="number"
                  value={i.qty}
                  onChange={(e) => changeQty(i.bor_id, e.target.value)}
                />
              </td>
              <td>{i.ar * i.qty} Ft</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => removeFromCart(i.bor_id)}>
                  ❌
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Vásárló adatai</h3>
      <Form>
        <Form.Control
          placeholder="Név"
          className="mb-2"
          onChange={(e) => setUser({ ...user, nev: e.target.value })}
        />
        <Form.Control
          placeholder="Cím"
          className="mb-2"
          onChange={(e) => setUser({ ...user, cim: e.target.value })}
        />
        <Form.Control
          placeholder="E-mail"
          className="mb-2"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </Form>

      <Button className="mt-3" onClick={submit}>Rendelés elküldése</Button>
    </Container>
  );
}
export default Checkout;
