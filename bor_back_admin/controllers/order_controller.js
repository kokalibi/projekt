const pool = require('../config/db');


exports.getAll = async (req, res) => {
    const [rows] = await db.query("SELECT * FROM rendelesek");
    res.json(rows);
};

exports.getById = async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM rendelesek WHERE rendeles_id = ?",
        [req.params.id]
    );
    res.json(rows[0]);
};

exports.szures = async (req, res) => {
    const { statusz } = req.query;
    const [rows] = await db.query(
        "SELECT * FROM rendelesek WHERE statusz = ?",
        [statusz]
    );
    res.json(rows);
};

exports.getRandom = async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM rendelesek ORDER BY RAND() LIMIT 1"
    );
    res.json(rows[0]);
};

exports.create = async (req, res) => {
    const { vasarlo_id, mennyiseg, fizetesi_mod } = req.body;

    await db.query(
        `INSERT INTO rendelesek (vasarlo_id, mennyiseg, fizetesi_mod)
         VALUES (?,?,?)`,
        [vasarlo_id, mennyiseg, fizetesi_mod]
    );

    res.json({ message: "Rendelés felvéve" });
};
