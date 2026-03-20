const express = require("express");
const router = express.Router();
const adatController = require("../controllers/adat_controller");

// Adatlekérések
router.get("/pincek", adatController.getPincek);
router.get("/orszagok", adatController.getOrszagok);
router.get("/fajtak", adatController.getFajtak);
router.get("/tipusok", adatController.getTipusok);
router.get("/evjaratok", adatController.getEvjaratok);

// Adatmentések
router.post("/pincek", adatController.addPince);
router.post("/orszagok", adatController.addOrszag);
router.post("/fajtak", adatController.addFajta);
router.post("/tipusok", adatController.addTipus);
router.post("/evjaratok", adatController.addEvjarat);

// Adattörlések
router.delete("/pincek/:id", adatController.removePince);
router.delete("/orszagok/:id", adatController.removeOrszag);
router.delete("/fajtak/:id", adatController.removeFajta);
router.delete("/tipusok/:id", adatController.removeTipus);
router.delete("/evjaratok/:id", adatController.removeEvjarat);

module.exports = router;