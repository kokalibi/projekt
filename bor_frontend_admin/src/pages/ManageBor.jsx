import React, { useEffect, useState } from "react";
import API from "../api";

export default function ManageBor() {
  const [borok, setBorok] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const response = await API.get("/borok");
      setBorok(response.data);
    } catch (err) {
      console.error("API hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteBor = async (id) => {
    if (!window.confirm("Biztosan törlöd ezt a bort?")) return;

    try {
      await API.delete(`/borok/${id}`);
      load();
    } catch (err) {
      console.error("Törlési hiba:", err);
      alert("Nem sikerült törölni!");
    }
  };

  if (loading) return <div className="p-5 text-center">Betöltés...</div>;

  return (
    <div className="container py-4">
      <h2>Borok kezelése</h2>

      {borok.length === 0 && (
        <div className="alert alert-info mt-3">
          Még nincs bor az adatbázisban.
        </div>
      )}

      <div className="row mt-3">
        {borok.map((b) => {
          const imageUrl = `http://localhost:8080/uploads/kep/${b.bor_id}.jpg`;

          return (
            <div className="col-md-4 mb-4" key={b.bor_id}>
              <div className="card shadow-sm">

                <div style={{
                    width: "100%",
                    height: "260px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f8f9fa",
                    borderTopLeftRadius: "6px",
                    borderTopRightRadius: "6px"
                  }}>
                    <img
                      src={`http://localhost:8080/uploads/kep/${b.bor_id}.jpg`}
                      alt={b.nev}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/easter egg3.jpg";
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "10px"
                      }}
                    />
                  </div>

                  
                <div className="card-body">
                  <h5>{b.nev}</h5>
                  <p className="text-muted">{b.pince_nev}</p>

                  <div className="d-flex justify-content-between mt-2">
                    <a
                      href={`/bor/${b.bor_id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Megnyitás
                    </a>

                    {/* FIX: modern törlés gomb */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteBor(b.bor_id)}
                      
                    >
                      🗑 Törlés
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
