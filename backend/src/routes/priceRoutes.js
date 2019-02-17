const express = require('express');
const authController = require('../controllers/authController');
const priceController = require('../controllers/priceController');

const router = express.Router();

router.get('/:numOfDays', authController.protect, priceController.getPricesForLastDays);
router.get('/', authController.protect, priceController.getCurrentPrices);

module.exports = router;
