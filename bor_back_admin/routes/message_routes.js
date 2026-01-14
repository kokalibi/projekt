const express = require("express");
const router = express.Router();
const Message = require("../models/message_model");
const auth = require("../middleware/auth_middleware");
const adminOnly = require("../middleware/admin_only");

// ➤ Üzenet küldése (Közös végpont felhasználónak és adminnak)
router.post("/send", auth, async (req, res) => {
  try {
    const { message, userId } = req.body;
    // Ha admin küldi, a body-ból vesszük a célpontot, ha felhasználó, a saját ID-ját a tokenből
    const targetUserId = req.user.role === 'admin' ? userId : (req.user.user_id || req.user.id);
    const senderType = req.user.role === 'admin' ? 'admin' : 'user';

    if (!targetUserId || !message) {
      return res.status(400).json({ error: "Hiányzó adatok: userId vagy üzenet szöveg" });
    }

    await Message.create(targetUserId, senderType, message);
    res.json({ success: true });
  } catch (err) {
    console.error("Adatbázis hiba:", err);
    res.status(500).json({ error: "Szerverhiba az üzenet mentésekor" });
  }
});

// ➤ Admin: Partnerek listázása
router.get("/admin/partners", auth, adminOnly, async (req, res) => {
  try {
    const partners = await Message.getChatPartners();
    res.json(partners);
  } catch (err) { res.status(500).json({ error: "Partnerlista hiba" }); }
});

// ➤ Admin: Egy konkrét chat lekérése
router.get("/admin/:userId", auth, adminOnly, async (req, res) => {
  try {
    const chat = await Message.getByUserId(req.params.userId);
    res.json(chat);
  } catch (err) { res.status(500).json({ error: "Chat lekérési hiba" }); }
});

// ➤ Felhasználó: Saját chat lekérése
router.get("/my-chat", auth, async (req, res) => {
  try {
    const uId = req.user.user_id || req.user.id;
    const chat = await Message.getByUserId(uId);
    res.json(chat);
  } catch (err) { res.status(500).json({ error: "Saját chat lekérési hiba" }); }
});

module.exports = router;