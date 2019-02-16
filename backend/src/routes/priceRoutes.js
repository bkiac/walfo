const express = require('express');
const priceController = require('../controllers/priceController');

const router = express.Router();

router.get('/', priceController.listCoins);

module.exports = router;
