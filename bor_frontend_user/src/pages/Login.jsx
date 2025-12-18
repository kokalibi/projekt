import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [hiba, setHiba] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, jelszo });
      login(res.data.accessToken, res.data.user);
      navigate("/");
    } catch (err) {
      setHiba(err.response?.data?.error || "Hiba történt");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2>Bejelentkezés</h2>

      {hiba && <div className="alert alert-danger">{hiba}</div>}

      <form onSubmit={handleLogin}>

        <div className="mb-3">
          <label className="form-label">Email cím</label>
          <input className="form-control"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Jelszó</label>
          <input type="password" className="form-control"
            value={jelszo} onChange={(e) => setJelszo(e.target.value)} />
        </div>

        <button className="btn btn-primary w-100">Belépés</button>

      </form>
    </div>
  );
}
