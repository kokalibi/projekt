const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/pincek", async (req, res) => {
  const [rows] = await pool.query("SELECT pince_id, nev FROM pincek ORDER BY nev");
  res.json(rows);
});

router.get("/fajtak", async (req, res) => {
  const [rows] = await pool.query("SELECT fajta_id, nev FROM fajtak ORDER BY nev");
  res.json(rows);
});

router.get("/evjaratok", async (req, res) => {
  const [rows] = await pool.query("SELECT evjarat_id, evjarat FROM evjaratok ORDER BY evjarat DESC");
  res.json(rows);
});

router.get("/tipusok", async (req, res) => {
  const [rows] = await pool.query("SELECT tipus_id, nev FROM bor_tipusok ORDER BY nev");
  res.json(rows);
});

module.exports = router;
