const db = require("../db");

exports.getByOrderId = async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM rendeles_tetelek WHERE rendeles_id = ?",
        [req.params.id]
    );
    res.json(rows);
};

exports.addItem = async (req, res) => {
    const { rendeles_id, bor_id, mennyiseg, osszeg } = req.body;

    await db.query(
        `INSERT INTO rendeles_tetelek (rendeles_id, bor_id, mennyiseg, osszeg)
         VALUES (?,?,?,?)`,
        [rendeles_id, bor_id, mennyiseg, osszeg]
    );

    res.json({ message: "Tétel hozzáadva" });
};
