import React, { useEffect, useState } from "react";
import API from "../api";

export default function ManageBor() {
  const [borok, setBorok] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/borok")
      .then((response) => setBorok(response.data))
      .catch((error) => console.error("API hiba:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-5 text-center">Betöltés...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Borok kezelése</h2>

      {borok.length === 0 && (
        <div className="alert alert-info mt-3">
          Még nincs egy bor sem az adatbázisban.
        </div>
      )}

      <div className="row g-4 mt-3">
        {borok.map((b) => (
          <div className="col-md-4" key={b.bor_id}>
            <div className="card shadow-sm">

              {/* Kép container */}
              <div
                style={{
                  width: "100%",
                  height: "250px",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderBottom: "1px solid #eee",
                }}
              >
                <img
                  src={`http://localhost:8080/uploads/kep/${b.bor_id}.jpg`}
                  alt={b.nev}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.src = "/easter egg3.jpg"; // fallback kép
                  }}
                />
              </div>

              <div className="card-body">
                <h5 className="mb-1">{b.nev}</h5>
                <p className="text-muted mb-2">{b.pince_nev}</p>

                <a
                  href={`/bor/${b.bor_id}`}
                  className="btn btn-primary w-100"
                >
                  Megnyitás
                </a>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
