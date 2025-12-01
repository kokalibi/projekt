const pool = require("../config/db");

module.exports = {
  addOrder: async (user, cart) => {
    const [order] = await pool.query(
      `INSERT INTO orders (nev, cim, email) VALUES (?,?,?)`,
      [user.nev, user.cim, user.email]
    );

    for (const item of cart) {
      await pool.query(
        `INSERT INTO order_items (order_id, bor_id, qty, price) VALUES (?,?,?,?)`,
        [order.insertId, item.bor_id, item.qty, item.ar]
      );
    }

    return order.insertId;
  }
};
