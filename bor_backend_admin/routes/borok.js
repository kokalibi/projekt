var Express = require('express');
var router = Express.Router();
const borokController = require('../controllers/bor_controller');
router.get('/', borokController.getAll);