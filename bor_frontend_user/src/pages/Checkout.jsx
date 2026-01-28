import { useEffect, useMemo, useState } from "react";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Importálva a hitelesítéshez

export default function Checkout() {
  /* =======================
     KOSÁR ÉS AUTH KONTEXTUS
  ======================= */
  const {
    cart = [],
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const { user } = useAuth(); // Bejelentkezett felhasználó kinyerése

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
     AUTOMATIKUS ADATKITÖLTÉS
     Figyeljük a 'user' változását az AuthContext-ből
  ======================= */
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        teljes_nev: user.nev || "",
        email: user.email || "",
        cim_sor1: user.cim || "" // A profilnál mentett alapértelmezett cím
      }));
    }
  }, [user]);

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

    // Alapvető validáció
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
      clearCart(); // Rendelés után ürítjük a kosarat
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
      <h1>Rendelés</h1>

      {hiba && <div className="alert alert-danger">{hiba}</div>}
      {siker && <div className="alert alert-success">{siker}</div>}

      <div className="row">
        {/* ===== SZÁLLÍTÁSI ŰRLAP ===== */}
        <div className="col-md-8">
          <form onSubmit={submit}>
            <div className="mb-2">
              <label className="form-label">Teljes név *</label>
              <input
                className="form-control"
                name="teljes_nev"
                placeholder="Példa Béla"
                value={form.teljes_nev}
                onChange={onChange}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Email cím</label>
              <input
                className="form-control"
                name="email"
                type="email"
                placeholder="valaki@valami.com"
                value={form.email}
                onChange={onChange}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Telefonszám</label>
              <input
                className="form-control"
                name="telefon"
                placeholder="+36 30 123 4567"
                value={form.telefon}
                onChange={onChange}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Ország *</label>
                <input
                  className="form-control"
                  name="orszag"
                  value={form.orszag}
                  onChange={onChange}
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Város *</label>
                <input
                  className="form-control"
                  name="varos"
                  placeholder="Budapest"
                  value={form.varos}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label">Irányítószám *</label>
              <input
                className="form-control"
                name="iranyitoszam"
                placeholder="1234"
                value={form.iranyitoszam}
                onChange={onChange}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Cím (utca, házszám) *</label>
              <input
                className="form-control"
                name="cim_sor1"
                placeholder="Bor utca 12."
                value={form.cim_sor1}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Kiegészítő cím (emelet, ajtó)</label>
              <input
                className="form-control"
                name="cim_sor2"
                placeholder="2. emelet 5. ajtó"
                value={form.cim_sor2}
                onChange={onChange}
              />
            </div>

            <button
              className="btn btn-success w-100 py-2 mb-5"
              disabled={loading}
            >
              {loading ? "Küldés..." : "Rendelés leadása"}
            </button>
          </form>
        </div>

        {/* ===== KOSÁR ÖSSZESÍTŐ ===== */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm sticky-top" style={{ top: "20px" }}>
            <h4>Kosár</h4>

            {cart.length === 0 && (
              <p className="text-muted text-center py-3">A kosár üres.</p>
            )}

            {cart.map(item => (
              <div key={item.bor_id} className="border-bottom py-2">
                <div className="d-flex justify-content-between align-items-start">
                  <strong className="text-truncate" style={{maxWidth: "150px"}}>{item.nev}</strong>
                  <button
                    className="btn btn-sm text-danger p-0"
                    onClick={() => removeFromCart(item.bor_id)}
                  >
                    ✕
                  </button>
                </div>

                <div className="d-flex align-items-center mt-2">
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateQuantity(item.bor_id, item.mennyiseg - 1)}
                    >
                      −
                    </button>
                    <span className="btn btn-outline-secondary disabled text-dark" style={{minWidth: "40px"}}>
                      {item.mennyiseg}
                    </span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateQuantity(item.bor_id, item.mennyiseg + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="ms-auto fw-bold">
                    {(item.ar * item.mennyiseg).toLocaleString()} Ft
                  </span>
                </div>
              </div>
            ))}

            <div className="mt-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Összesen:</h5>
              <h5 className="mb-0 text-primary">{osszesen.toLocaleString()} Ft</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}