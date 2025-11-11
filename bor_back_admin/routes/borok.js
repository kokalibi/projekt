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

module.exports = router;
