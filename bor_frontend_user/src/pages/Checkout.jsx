import { useState, useEffect } from "react";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cart, removeFromCart, changeQty, clearCart } = useCart();
  const { user } = useAuth();

  // Űrlap mezők
  const [nev, setNev] = useState("");
  const [email, setEmail] = useState("");
  const [cim, setCim] = useState("");

  // Állapotok
  const [hiba, setHiba] = useState("");
  const [siker, setSiker] = useState("");

  // Ha user be van jelentkezve → automatikus kitöltés
  useEffect(() => {
    if (user) {
      setNev(user.nev || "");
      setEmail(user.email || "");
      setCim(user.cim || "");
    }
  }, [user]);

  // Kosár összeg
  const total = cart.reduce((sum, item) => sum + item.ar * item.qty, 0);

  // Rendelés küldése
  const submitOrder = async (e) => {
    e.preventDefault();

    if (!nev || !email || !cim) {
      setHiba("Minden mezőt ki kell tölteni!");
      return;
    }

    if (cart.length === 0) {
      setHiba("A kosár üres!");
      return;
    }

    try {
      setHiba("");
      setSiker("");

      // 1) Rendelés létrehozása
      const orderRes = await API.post("/orders", {
        nev,
        email,
        cim
      });

      const orderId = orderRes.data.order_id;

      // 2) Tételek mentése
      for (const item of cart) {
        await API.post("/order-items", {
          order_id: orderId,
          bor_id: item.bor_id,
          mennyiseg: item.qty
        });
      }

      setSiker("A rendelés sikeresen elküldve!");
      clearCart();

    } catch (err) {
      console.error(err);
      setHiba("Hiba történt a rendelés leadásakor.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Rendelés</h2>

      {hiba && <div className="alert alert-danger">{hiba}</div>}
      {siker && <div className="alert alert-success">{siker}</div>}

      <div className="row">
        {/* Bal oldal – űrlap */}
        <div className="col-md-6">
          <form onSubmit={submitOrder}>

            <div className="mb-3">
              <label className="form-label">Név</label>
              <input
                className="form-control"
                value={nev}
                onChange={(e) => setNev(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Cím</label>
              <input
                className="form-control"
                value={cim}
                onChange={(e) => setCim(e.target.value)}
              />
            </div>

            <button className="btn btn-success w-100">
              Rendelés leadása
            </button>
          </form>
        </div>

        {/* Jobb oldal – kosár tartalma */}
        <div className="col-md-6">
          <h4>Kosár</h4>

          {cart.length === 0 && <p>A kosár üres.</p>}

          {cart.map((item) => (
            <div
              key={item.bor_id}
              className="d-flex align-items-center justify-content-between border-bottom py-2"
            >
              <div>
                <strong>{item.nev}</strong>
                <div>{item.ar} Ft</div>
              </div>

              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => changeQty(item.bor_id, item.qty - 1)}
                >
                  -
                </button>

                <span className="mx-2">{item.qty}</span>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => changeQty(item.bor_id, item.qty + 1)}
                >
                  +
                </button>

                <button
                  className="btn btn-danger btn-sm ms-3"
                  onClick={() => removeFromCart(item.bor_id)}
                >
                  X
                </button>
              </div>
            </div>
          ))}

          <h5 className="mt-3">Összesen: {total} Ft</h5>
        </div>
      </div>
    </div>
  );
}
