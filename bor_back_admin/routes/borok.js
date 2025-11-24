const express = require('express');
const router = express.Router();
const controller = require('../controllers/bor_controller');

router.get('/', controller.getAll);
router.get('/szures', controller.szures);
router.get('/kezdo/:kezdo', controller.getByKezdoBetuk);
router.post('/', controller.addBor);
router.delete('/:id', controller.deleteBor);
router.get('/:id', controller.getById);

module.exports = router;
