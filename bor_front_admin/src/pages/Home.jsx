import React from "react";
import { Card } from "react-bootstrap";

function Home() {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h2>Üdvözöllek az Admin Felületen 🍷</h2>
        <p>Itt tudod kezelni a bor webshop adatbázisát — borok hozzáadása, törlése, szűrése.</p>
      </Card.Body>
    </Card>
  );
}

export default Home;
