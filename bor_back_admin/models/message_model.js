const db = require("../config/db");

const Message = {
  create: async (userId, senderType, text) => {
    const [result] = await db.query(
      "INSERT INTO messages (user_id, sender_type, message, is_read) VALUES (?, ?, ?, FALSE)",
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
    // Kiegészítve az unread_count lekérdezésével
    const [rows] = await db.query(`
      SELECT u.user_id, u.nev, u.email, MAX(m.created_at) as utolso,
      (SELECT COUNT(*) FROM messages m2 WHERE m2.user_id = u.user_id AND m2.is_read = FALSE AND m2.sender_type = 'user') as unread_count
      FROM users u
      JOIN messages m ON u.user_id = m.user_id
      GROUP BY u.user_id
      ORDER BY utolso DESC
    `);
    return rows;
  },
  markAsRead: async (userId) => {
    const [result] = await db.query(
      "UPDATE messages SET is_read = TRUE WHERE user_id = ? AND sender_type = 'user' AND is_read = FALSE",
      [userId]
    );
    return result;
  }
};
module.exports = Message;