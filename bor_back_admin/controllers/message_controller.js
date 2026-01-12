const Message = require("../models/message_model");

exports.sendMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;
    const senderType = req.user.role === 'admin' ? 'admin' : 'user';
    const targetUserId = req.user.role === 'admin' ? userId : req.user.user_id;
    
    await Message.create(targetUserId, senderType, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.user_id;
    const chat = await Message.getByUserId(userId);
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};