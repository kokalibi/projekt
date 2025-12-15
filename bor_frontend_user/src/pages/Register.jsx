import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nev, setNev] = useState("");
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [cim, setCim] = useState("");
  const [hiba, setHiba] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/register", {
      nev, email, jelszo, cim
    });

    login(res.data.accessToken, res.data.user);
    navigate("/");
  } catch (err) {
    setHiba(err.response?.data?.error || "Hiba történt");
  }
};


  return (
    <div className="container mt-5" style={{ maxWidth: 550 }}>
      <h2>Regisztráció</h2>

      {hiba && <div className="alert alert-danger">{hiba}</div>}

      <form onSubmit={handleRegister}>

        <div className="mb-3">
          <label className="form-label">Név</label>
          <input className="form-control" value={nev} 
                 onChange={(e) => setNev(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} 
                 onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Jelszó</label>
          <input type="password" className="form-control" value={jelszo}
                 onChange={(e) => setJelszo(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Cím</label>
          <input className="form-control" value={cim}
                 onChange={(e) => setCim(e.target.value)} />
        </div>

        <button className="btn btn-success w-100">Regisztráció</button>
      </form>
    </div>
  );
}
