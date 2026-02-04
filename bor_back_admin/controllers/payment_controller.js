const Payment = require("../models/payment_model");

exports.getPaymentMethods = async (req, res) => {
    try {
        const methods = await Payment.getAllActive();
        res.json(methods);
    } catch (err) {
        res.status(500).json({ error: "Hiba a fizetési módok lekérésekor" });
    }
};