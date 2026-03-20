const BaseData = require("../models/base_data_model");

// GET kérések kezelése
exports.getPincek = async (req, res) => { try { res.json(await BaseData.getAllPince()); } catch (err) { res.status(500).json({ error: "Hiba a pincék lekérésekor" }); } };
exports.getOrszagok = async (req, res) => { try { res.json(await BaseData.getAllOrszagok()); } catch (err) { res.status(500).json({ error: "Hiba az országok lekérésekor" }); } };
exports.getFajtak = async (req, res) => { try { res.json(await BaseData.getAllFajta()); } catch (err) { res.status(500).json({ error: "Hiba a fajták lekérésekor" }); } };
exports.getTipusok = async (req, res) => { try { res.json(await BaseData.getAllTipus()); } catch (err) { res.status(500).json({ error: "Hiba a típusok lekérésekor" }); } };
exports.getEvjaratok = async (req, res) => { try { res.json(await BaseData.getAllEvjarat()); } catch (err) { res.status(500).json({ error: "Hiba az évjáratok lekérésekor" }); } };

// POST kérések (Adatfelvétel)
exports.addPince = async (req, res) => { try { await BaseData.createPince(req.body); res.json({ success: true }); } catch (err) { res.status(500).json({ error: "Hiba a mentéskor" }); } };
exports.addOrszag = async (req, res) => { try { await BaseData.createOrszag(req.body.nev); res.json({ success: true }); } catch (err) { res.status(500).json({ error: "Hiba" }); } };
exports.addFajta = async (req, res) => { try { await BaseData.createFajta(req.body); res.json({ success: true }); } catch (err) { res.status(500).json({ error: "Hiba" }); } };
exports.addTipus = async (req, res) => { try { await BaseData.createTipus(req.body.nev); res.json({ success: true }); } catch (err) { res.status(500).json({ error: "Hiba" }); } };
exports.addEvjarat = async (req, res) => { try { await BaseData.createEvjarat(req.body.evjarat); res.json({ success: true }); } catch (err) { res.status(500).json({ error: "Hiba" }); } };

// DELETE kérések (Törlés)
exports.removePince = async (req, res) => {
  try { await BaseData.deletePince(req.params.id); res.json({ success: true }); } 
  catch (err) { res.status(400).json({ error: "Nem törölhető: már van hozzá rendelve bor!" }); }
};
exports.removeOrszag = async (req, res) => {
  try { await BaseData.deleteOrszag(req.params.id); res.json({ success: true }); } 
  catch (err) { res.status(400).json({ error: "Nem törölhető: használatban van!" }); }
};
exports.removeFajta = async (req, res) => {
  try { await BaseData.deleteFajta(req.params.id); res.json({ success: true }); } 
  catch (err) { res.status(400).json({ error: "Nem törölhető: használatban van!" }); }
};
exports.removeTipus = async (req, res) => {
  try { await BaseData.deleteTipus(req.params.id); res.json({ success: true }); } 
  catch (err) { res.status(400).json({ error: "Nem törölhető: használatban van!" }); }
};
exports.removeEvjarat = async (req, res) => {
  try { await BaseData.deleteEvjarat(req.params.id); res.json({ success: true }); } 
  catch (err) { res.status(400).json({ error: "Nem törölhető: használatban van!" }); }
};