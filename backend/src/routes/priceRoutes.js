const express = require('express');
const authController = require('../controllers/authController');
const priceController = require('../controllers/priceController');
// const validationController = require('../controllers/validationController');

const router = express.Router();

router.get('/', authController.protect, priceController.getCurrentPrices);

// router.get(
//   '/:numOfDays',
//   authController.protect,
//   validationController.getPricesForLastDaysValidators,
//   validationController.validate,
//   priceController.getPricesForLastDays,
// );

module.exports = router;
