const db = require("../config/db");

const Payment = {
    getAllActive: async () => {
        const [rows] = await db.query("SELECT * FROM fizetesi_modok WHERE aktiv = 1");
        return rows;
    }
};

module.exports = Payment;