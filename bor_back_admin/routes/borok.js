var Express = require('express');
var router = Express.Router();
const borokController = require('../controllers/bor_controller');
router.get('/', borokController.getAll);
router.get('/:kezdo', borokController.getByKezdoBetuk);
router.post("/", borokController.addBor);
router.delete("/:id", borokController.deleteBor);
module.exports = router;