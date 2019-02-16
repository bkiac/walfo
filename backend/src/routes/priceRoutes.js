const express = require('express');
const priceController = require('../controllers/priceController');

const router = express.Router();

router.get('/:numOfDays', priceController.getPricesForLastDays);
router.get('/', priceController.getCurrentPrices);

module.exports = router;
