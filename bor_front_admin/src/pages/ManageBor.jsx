import React, { useState } from "react";
import BorLista from "../components/BorLista";
import Szurok from "../components/Szurok";

function ManageBor() {
  const [refresh, setRefresh] = useState(false);
  const toggleRefresh = () => setRefresh(!refresh);

  return (
    <div>
      <h3 className="mb-3">Borok kezelése</h3>
      <Szurok onFilter={toggleRefresh} />
      <BorLista refresh={refresh} />
    </div>
  );
}

export default ManageBor;
