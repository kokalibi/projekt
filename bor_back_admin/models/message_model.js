const db = require("../config/db");

const Message = {
  create: async (userId, senderType, text) => {
    const [result] = await db.query(
      "INSERT INTO messages (user_id, sender_type, message) VALUES (?, ?, ?)",
      [userId, senderType, text]
    );
    return result.insertId;
  },
  getByUserId: async (userId) => {
    const [rows] = await db.query(
      "SELECT * FROM messages WHERE user_id = ? ORDER BY created_at ASC",
      [userId]
    );
    return rows;
  },
  getChatPartners: async () => {
    const [rows] = await db.query(`
      SELECT u.user_id, u.nev, u.email, MAX(m.created_at) as utolso
      FROM users u
      JOIN messages m ON u.user_id = m.user_id
      GROUP BY u.user_id
      ORDER BY utolso DESC
    `);
    return rows;
  }
};
module.exports = Message;