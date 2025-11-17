import React, { useEffect, useState } from "react";
import Szurok from "../components/Szurok";
import BorCards from "../components/BorCards";
import API from "../api";

function ManageBor() {
  const [borok, setBorok] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await API.get("/borok");
      setBorok(res.data);
    } catch (err) {
      console.error("Hiba borok betöltésénél:", err);
      setBorok([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div>
      <h3 className="mb-3">Borok kezelése</h3>

      <Szurok onResults={(results) => setBorok(results)} />

      {loading ? (
        <div className="text-center py-5">Betöltés...</div>
      ) : (
        <div className="mt-3">
          <BorCards borok={borok} onRefresh={loadAll} />
        </div>
      )}
    </div>
  );
}

export default ManageBor;
