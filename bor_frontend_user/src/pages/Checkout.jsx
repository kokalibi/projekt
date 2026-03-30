import { useEffect, useMemo, useState } from "react";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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

  const { user } = useAuth();

  /* =======================
     ŰRLAP ÁLLAPOTOK
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

  // ÚJ: Külön állapot a számlázási címnek
  const [szamlazasiForm, setSzamlazasiForm] = useState({
    teljes_nev: "",
    orszag: "Magyarorszag",
    varos: "",
    iranyitoszam: "",
    cim_sor1: "",
    cim_sor2: ""
  });

  const [azonosCim, setAzonosCim] = useState(true);

  /* =======================
     FIZETÉSI MÓD ÁLLAPOTOK
  ======================= */
  const [fizetesiModok, setFizetesiModok] = useState([]);
  const [valasztottModId, setValasztottModId] = useState("");

  /* =======================
     UI ÁLLAPOTOK
  ======================= */
  const [loading, setLoading] = useState(false);
  const [hiba, setHiba] = useState("");
  const [siker, setSiker] = useState("");

  /* =======================
     AUTOMATIKUS ADATKITÖLTÉS + FIZETÉSI MÓDOK BETÖLTÉSE
  ======================= */
  useEffect(() => {
    API.get("/payment-methods")
      .then(res => {
        setFizetesiModok(res.data);
        if (res.data.length > 0) setValasztottModId(res.data[0].id);
      })
      .catch(err => console.error("Fizetési módok hiba:", err));

    if (user) {
      setForm(prev => ({
        ...prev,
        teljes_nev: user.nev || "",
        email: user.email || "",
        cim_sor1: user.cim || ""
      }));
    }
  }, [user]);

  /* =======================
     VÉGÖSSZEG (NaN-BIZTOS)
  ======================= */
  const osszesen = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.ar || 0) * Number(item.mennyiseg || 1),
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

  const onSzamlazasiChange = (e) => {
    const { name, value } = e.target;
    setSzamlazasiForm(prev => ({ ...prev, [name]: value }));
  };

  /* =======================
     RENDELÉS LEADÁSA
  ======================= */
  const submit = async (e) => {
    e.preventDefault();
    setHiba("");
    setSiker("");

    // Alapvető ellenőrzések a küldés előtt
    if (cart.length === 0) {
      setHiba("A kosár üres.");
      return;
    }

    if (!valasztottModId) {
      setHiba("Kérjük, válassz fizetési módot.");
      return;
    }

    // LOGIKA: Ha az azonosCim true, null-t küldünk, így a backend 
    // tudja, hogy a szállítási cím ID-ját kell használnia másodszor is.
    const payload = {
      fizetesi_mod_id: valasztottModId,
      szallitasi_cim: form,
      szamlazasi_cim: azonosCim ? null : szamlazasiForm, 
      kosar: cart.map(item => ({
        bor_id: item.bor_id,
        bor_nev: item.nev,
        egysegar: Number(item.ar),
        mennyiseg: Number(item.mennyiseg || 1)
      })),
      vegosszeg: osszesen
    };

    try {
      setLoading(true);
      // API hívás a backend felé
      const res = await API.post("/orders", payload);
      
      // Sikeres rendelés esetén visszajelzés és kosár ürítés
      setSiker(`Rendelés sikeres! Azonosító: ${res.data.rendeles_id}`);
      clearCart();
      
      // Opcionális: 2 másodperc múlva visszairányítás a főoldalra
      // setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      console.error("Rendelés hiba:", err);
      // Hibaüzenet megjelenítése a felhasználónak
      setHiba(err.response?.data?.error || "Hiba történt a rendelés leadásakor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Rendelés</h1>
      {hiba && <div className="alert alert-danger">{hiba}</div>}
      {siker && <div className="alert alert-success">{siker}</div>}

      <div className="row">
        <div className="col-md-8">
          <form onSubmit={submit}>
            {/* SZÁLLÍTÁSI CÍM */}
            <div className="card p-3 mb-4 shadow-sm">
              <h5 className="mb-3">Szállítási adatok</h5>
              <div className="mb-2">
                <label className="form-label">Teljes név *</label>
                <input required className="form-control" name="teljes_nev" value={form.teljes_nev} onChange={onChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Email cím *</label>
                <input required className="form-control" name="email" type="email" value={form.email} onChange={onChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Telefonszám *</label>
                <input required className="form-control" name="telefon" value={form.telefon} onChange={onChange} />
              </div>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Ország *</label>
                  <input required className="form-control" name="orszag" value={form.orszag} onChange={onChange} />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Város *</label>
                  <input required className="form-control" name="varos" value={form.varos} onChange={onChange} />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label">Irányítószám *</label>
                <input required className="form-control" name="iranyitoszam" value={form.iranyitoszam} onChange={onChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Cím (utca, házszám) *</label>
                <input required className="form-control" name="cim_sor1" value={form.cim_sor1} onChange={onChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Kiegészítő cím (emelet, ajtó)</label>
                <input className="form-control" name="cim_sor2" value={form.cim_sor2} onChange={onChange} />
              </div>
            </div>

            {/* SZÁMLÁZÁSI CÍM OPCIÓ */}
            <div className="card p-3 mb-4 shadow-sm">
              <div className="form-check mb-3">
                <input 
                   className="form-check-input" 
                   type="checkbox" 
                   id="azonosCim" 
                   checked={azonosCim} 
                   onChange={(e) => setAzonosCim(e.target.checked)} 
                />
                <label className="form-check-label" htmlFor="azonosCim">
                  A számlázási cím megegyezik a szállítással
                </label>
              </div>

              {!azonosCim && (
                <div className="mt-3">
                  <h5 className="mb-3">Számlázási adatok</h5>
                  <div className="mb-2">
                    <label className="form-label">Számlázási név *</label>
                    <input required className="form-control" name="teljes_nev" value={szamlazasiForm.teljes_nev} onChange={onSzamlazasiChange} />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label className="form-label">Város *</label>
                      <input required className="form-control" name="varos" value={szamlazasiForm.varos} onChange={onSzamlazasiChange} />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label className="form-label">Irányítószám *</label>
                      <input required className="form-control" name="iranyitoszam" value={szamlazasiForm.iranyitoszam} onChange={onSzamlazasiChange} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Cím (utca, házszám) *</label>
                    <input required className="form-control" name="cim_sor1" value={szamlazasiForm.cim_sor1} onChange={onSzamlazasiChange} />
                  </div>
                </div>
              )}
            </div>

            {/* FIZETÉSI MÓD */}
            <div className="card p-3 mb-4 shadow-sm">
              <h5 className="mb-3">Fizetési mód kiválasztása *</h5>
              {fizetesiModok.map((mod) => (
                <div key={mod.id} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id={`payment-${mod.id}`}
                    value={mod.id}
                    checked={valasztottModId === mod.id}
                    onChange={() => setValasztottModId(mod.id)}
                  />
                  <label className="form-check-label" htmlFor={`payment-${mod.id}`}>
                    {mod.megnevezes}
                  </label>
                </div>
              ))}
            </div>

            <button className="btn btn-success w-100 py-2 mb-5" disabled={loading || cart.length === 0}>
              {loading ? "Küldés..." : "Rendelés leadása"}
            </button>
          </form>
        </div>

        {/* KOSÁR ÖSSZESÍTŐ + SZERKESZTŐ FUNKCIÓK */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm sticky-top" style={{ top: "20px" }}>
            <h4 className="border-bottom pb-2">Kosár</h4>
            {cart.length === 0 ? (
              <p className="text-muted mt-2">A kosarad üres.</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.bor_id} className="border-bottom py-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-truncate" style={{maxWidth: "150px"}} title={item.nev}>
                        {item.nev}
                      </strong>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-link text-danger p-0"
                        style={{textDecoration: 'none'}}
                        onClick={() => removeFromCart(item.bor_id)}
                      >
                        Törlés
                      </button>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2 border rounded px-1" style={{background: '#f8f9fa'}}>
                        <button 
                          type="button" 
                          className="btn btn-sm p-0 px-2 fw-bold"
                          onClick={() => updateQuantity(item.bor_id, item.mennyiseg - 1)}
                        >
                          -
                        </button>
                        <span className="small fw-bold">{item.mennyiseg} db</span>
                        <button 
                          type="button" 
                          className="btn btn-sm p-0 px-2 fw-bold"
                          onClick={() => updateQuantity(item.bor_id, item.mennyiseg + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="fw-bold">{(item.ar * item.mennyiseg).toLocaleString()} Ft</span>
                    </div>
                  </div>
                ))}
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Összesen:</h5>
                  <h5 className="text-primary mb-0">{osszesen.toLocaleString()} Ft</h5>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}