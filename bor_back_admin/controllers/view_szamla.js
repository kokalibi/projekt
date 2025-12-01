const db = require("../db");

exports.getAll = async (req, res) => {
    const [rows] = await db.query("SELECT * FROM view_szamla");
    res.json(rows);
};

exports.getByInvoiceId = async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM view_szamla WHERE szamla_id = ?",
        [req.params.id]
    );
    res.json(rows);
};
