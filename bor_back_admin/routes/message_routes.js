const express = require("express");
const router = express.Router();
const Message = require("../models/message_model");
const auth = require("../middleware/auth_middleware");
const adminOnly = require("../middleware/admin_only");

/**
 * Üzenet küldése (Közös végpont a felhasználó és az admin számára)
 * Ment az adatbázisba, majd WebSocketen keresztül azonnal továbbít.
 */
router.post("/send", auth, async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    // Célpont meghatározása: 
    // Ha admin ír, a body-ból vesszük a cél user ID-t. 
    // Ha user ír, a saját ID-ját használjuk.
    const targetUserId = req.user.role === 'admin' ? userId : (req.user.user_id || req.user.id);
    const senderType = req.user.role === 'admin' ? 'admin' : 'user';

    if (!targetUserId || !message) {
      return res.status(400).json({ error: "Hiányzó adatok: userId vagy üzenet szöveg." });
    }

    // 1. MENTÉS AZ ADATBÁZISBA (A tartósság érdekében)
    await Message.create(targetUserId, senderType, message);

    // 2. VALÓS IDEJŰ TOVÁBBÍTÁS WEBSOCKETEN
    const io = req.app.get("io");
    if (io) {
      // Üzenet küldése a specifikus szobába (szoba neve: room_ID)
      io.to(`room_${targetUserId}`).emit("new_message", {
        userId: targetUserId, // Az admin oldali azonosításhoz szükséges
        sender_type: senderType,
        message: message,
        created_at: new Date()
      });

      // Ha a FELHASZNÁLÓ küldte az üzenetet, értesítjük az admint:
      if (senderType === 'user') {
        // Frissíti az admin partnerlistáját (ha új a user, megjelenik a listában)
        io.emit("update_partner_list");
        // Jelzést küld a Navbarban lévő összesített piros számlálónak
        io.emit("admin_notification", { userId: targetUserId });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Hiba az üzenetküldés során:", err);
    res.status(500).json({ error: "Szerverhiba az üzenet küldésekor." });
  }
});

/**
 * Admin: Az összes chat partner lekérése
 * Meghatározza, kikkel van folyamatban lévő beszélgetés.
 */
router.get("/admin/partners", auth, adminOnly, async (req, res) => {
  try {
    const partners = await Message.getChatPartners();
    res.json(partners);
  } catch (err) {
    console.error("Hiba a partnerek lekérésekor:", err);
    res.status(500).json({ error: "Nem sikerült lekérni a partnereket." });
  }
});

/**
 * Admin: Egy adott felhasználóval folytatott beszélgetés előzményei
 */
router.get("/admin/:userId", auth, adminOnly, async (req, res) => {
  try {
    const chat = await Message.getByUserId(req.params.userId);
    res.json(chat);
  } catch (err) {
    console.error("Hiba a beszélgetés lekérésekor:", err);
    res.status(500).json({ error: "Nem sikerült lekérni a beszélgetést." });
  }
});

/**
 * Felhasználó: Saját beszélgetési előzményeinek lekérése
 */
router.get("/my-chat", auth, async (req, res) => {
  try {
    const uId = req.user.user_id || req.user.id;
    const chat = await Message.getByUserId(uId);
    res.json(chat);
  } catch (err) {
    console.error("Hiba a saját chat lekérésekor:", err);
    res.status(500).json({ error: "Nem sikerült lekérni a saját beszélgetést." });
  }
});

router.put("/read/:userId", auth, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: "Érvénytelen azonosító" });
    }
    await Message.markAsRead(userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba az olvasottá tételkor" });
  }
});

module.exports = router;