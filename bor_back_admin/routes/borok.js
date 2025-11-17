const express = require('express');
const router = express.Router();
const controller = require('../controllers/bor_controller');

router.get('/', controller.getAll);
router.get('/nev/:kezdo', controller.getByKezdoBetuk);
router.get('/tipus/:tipus_nev', controller.getByTipusNev);
router.get('/fajta/:fajta_nev', controller.getByFajtaNev);
router.get('/evjarat/:evjarat', controller.getByEvjarat);
router.get('/pince/:pince_nev', controller.getByPinceNev);
router.post('/', controller.addBor);
router.delete('/:id', controller.deleteBor);
router.get('/:id', controller.getById);


router.get('/pincek', async (req, res) => {
  const [rows] = await pool.query("SELECT pince_id, nev FROM pincek ORDER BY nev");
  res.json(rows);
});
router.get('/fajtak', async (req, res) => {
  const [rows] = await pool.query("SELECT fajta_id, nev FROM fajtak ORDER BY nev");
  res.json(rows);
});
router.get('/evjaratok', async (req, res) => {
  const [rows] = await pool.query("SELECT evjarat_id, evjarat FROM evjaratok ORDER BY evjarat DESC");
  res.json(rows);
});
router.get('/tipusok', async (req, res) => {
  const [rows] = await pool.query("SELECT tipus_id, nev FROM bor_tipusok ORDER BY nev");
  res.json(rows);
});


module.exports = router;
