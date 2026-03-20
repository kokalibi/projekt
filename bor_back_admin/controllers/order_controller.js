const Order = require("../models/order_model");

exports.getMyOrders = async (req, res) => {
  try {
    const userEmail = req.user ? req.user.email : null; //

    if (!userEmail) {
      return res.status(401).json({ error: "Bejelentkezés szükséges!" });
    }

    const orders = await Order.getByUserEmail(userEmail); //
    res.json(orders);
  } catch (err) {
    console.error("getMyOrders hiba:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll(req.query); //
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id); //
    res.json(order || {});
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.getOrderItems = async (req, res) => {
  try {
    const items = await Order.getItems(req.params.id); //
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.addOrder = async (req, res) => {
  try {
    const { szallitasi_cim, kosar, fizetesi_mod_id } = req.body; //
    const vegosszeg = kosar.reduce((sum, item) => sum + item.egysegar * item.mennyiseg, 0); //

    const result = await Order.create({ szallitasi_cim, kosar, fizetesi_mod_id, vegosszeg }); //
    res.json({ rendeles_id: result.orderId, vegosszeg: result.vegosszeg });
  } catch (err) {
    res.status(500).json({ error: "Sikertelen mentés" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    await Order.updateStatus(req.params.id, req.body.statusz_id); //
    res.json({ message: "Frissítve" });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Order.delete(id);

    if (success) {
      res.json({ message: "Rendelés sikeresen törölve!" });
    } else {
      res.status(404).json({ error: "A rendelés nem található." });
    }
  } catch (err) {
    console.error("deleteOrder hiba:", err);
    res.status(500).json({ error: "Hiba történt a törlés során." });
  }
};