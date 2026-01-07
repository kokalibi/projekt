import { useEffect, useMemo, useState } from "react";
import API from "../api";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  /* =======================
     KOSÁR
  ======================= */
 const {
  cart = [],
  updateQuantity,
  removeFromCart,
  clearCart
} = useCart();


  /* =======================
     ŰRLAP ÁLLAPOT
  ======================= */
  const [form, setForm] = useState({
    teljes_nev: "",
    email: "",
    telefon: "",
    orszag: "Magyarorszag",
    varos: "",
    iranyitoszam: "",
    cim_sor1: "",
    cim_sor2: ""
  });

  /* =======================
     UI ÁLLAPOTOK
  ======================= */
  const [loading, setLoading] = useState(false);
  const [hiba, setHiba] = useState("");
  const [siker, setSiker] = useState("");

  /* =======================
     BEJELENTKEZETT USER ADATAI
     /api/auth/me
  ======================= */
useEffect(() => {
  const loadUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setForm(prev => ({
        ...prev,
        teljes_nev: res.data.nev || "",
        email: res.data.email || "",
        cim_sor1: res.data.cim || ""
      }));
    } catch {}
  };
  loadUser();
}, []);


  /* =======================
     VÉGÖSSZEG (NaN-BIZTOS)
  ======================= */
  const osszesen = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        Number(item.ar || 0) * Number(item.mennyiseg || 1),
      0
    );
  }, [cart]);

  /* =======================
     INPUT KEZELÉS
  ======================= */
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* =======================
     RENDELÉS LEADÁSA
  ======================= */
  const submit = async (e) => {
    e.preventDefault();
    setHiba("");
    setSiker("");

    if (cart.length === 0) {
      setHiba("A kosar ures.");
      return;
    }

    if (
      !form.teljes_nev ||
      !form.orszag ||
      !form.varos ||
      !form.iranyitoszam ||
      !form.cim_sor1
    ) {
      setHiba("Kerlek toltsd ki a kotelezo mezoket.");
      return;
    }

    const payload = {
      fizetesi_mod: "utanvet",
      szallitasi_cim: form,
      szamlazasi_cim: form,
      kosar: cart.map(item => ({
        bor_id: item.bor_id,
        bor_nev: item.nev,
        egysegar: Number(item.ar),
        mennyiseg: Number(item.mennyiseg || 1)
      }))
    };

    try {
      setLoading(true);
      const res = await API.post("/orders", payload);
      setSiker(`Rendeles sikeres! Azonosito: ${res.data.rendeles_id}`);
      clearCart();
    } catch (err) {
      console.error(err);
      setHiba("Hiba tortent a rendeles leadasakor.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="container mt-4">
      <h1>Rendeles</h1>

      {hiba && <div className="alert alert-danger">{hiba}</div>}
      {siker && <div className="alert alert-success">{siker}</div>}

      <div className="row">
        {/* ===== ŰRLAP ===== */}
        <div className="col-md-8">
          <form onSubmit={submit}>
            <input
              className="form-control mb-2"
              name="teljes_nev"
              placeholder="Teljes nev *"
              value={form.teljes_nev}
              onChange={onChange}
            />

            <input
              className="form-control mb-2"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
            />

            <input
              className="form-control mb-2"
              name="telefon"
              placeholder="Telefon"
              value={form.telefon}
              onChange={onChange}
            />

            <input
              className="form-control mb-2"
              name="orszag"
              placeholder="Orszag *"
              value={form.orszag}
              onChange={onChange}
            />

            <input
              className="form-control mb-2"
              name="varos"
              placeholder="Varos *"
              value={form.varos}
              onChange={onChange}
            />

            <input
              className="form-control mb-2"
              name="iranyitoszam"
              placeholder="Iranyitoszam *"
              value={form.iranyitoszam}
              onChange={onChange}
            />

            <input
              className="form-control mb-2"
              name="cim_sor1"
              placeholder="Cim *"
              value={form.cim_sor1}
              onChange={onChange}
            />

            <input
              className="form-control mb-3"
              name="cim_sor2"
              placeholder="Cim (opcionalis)"
              value={form.cim_sor2}
              onChange={onChange}
            />

            <button
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Kuld..." : "Rendeles leadasa"}
            </button>
          </form>
        </div>

        {/* ===== KOSÁR ===== */}
        <div className="col-md-4">
  <h4>Kosar</h4>

  {cart.length === 0 && (
    <p className="text-muted">A kosar ures.</p>
  )}

  {cart.map(item => (
  <div key={item.bor_id} className="border-bottom py-2">
    <strong>{item.nev}</strong>

    <div className="d-flex align-items-center mt-1">
      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={() =>
          updateQuantity(item.bor_id, item.mennyiseg - 1)
        }
      >
        −
      </button>

      <span className="mx-2">{item.mennyiseg}</span>

      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={() =>
          updateQuantity(item.bor_id, item.mennyiseg + 1)
        }
      >
        +
      </button>

      <span className="ms-auto">
        {item.ar * item.mennyiseg} Ft
      </span>

      <button
        className="btn btn-sm btn-danger ms-2"
        onClick={() => removeFromCart(item.bor_id)}
      >
        ✕
      </button>
    </div>
  </div>
))}


  <h5 className="mt-3">
    Osszesen: {osszesen} Ft
  </h5>
</div>

      </div>
    </div>
  );
}
