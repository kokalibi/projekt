const Order = require("../models/order_model");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    res.json(order || {});
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.getOrderItems = async (req, res) => {
  try {
    const items = await Order.getItems(req.params.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};

exports.addOrder = async (req, res) => {
  try {
    const { szallitasi_cim, szamlazasi_cim, kosar, fizetesi_mod } = req.body;
    if (!szallitasi_cim || !kosar || kosar.length === 0) {
      return res.status(400).json({ error: "Hianyos adatok" });
    }

    const vegosszeg = kosar.reduce((sum, item) => sum + item.egysegar * item.mennyiseg, 0);
    const result = await Order.create({ szallitasi_cim, szamlazasi_cim, kosar, fizetesi_mod, vegosszeg });

    res.json({ rendeles_id: result.orderId, vegosszeg: result.vegosszeg });
  } catch (err) {
    res.status(500).json({ error: "Sikertelen rendelés" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { statusz_id } = req.body;
    if (!statusz_id) return res.status(400).json({ error: "Hianyzo statusz_id" });
    await Order.updateStatus(req.params.id, statusz_id);
    res.json({ message: "Statusz frissitve" });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba" });
  }
};