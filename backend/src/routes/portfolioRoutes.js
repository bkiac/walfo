const express = require('express');
const authController = require('../controllers/authController');
const portfolioController = require('../controllers/portfolioController');
const validationController = require('../controllers/validationController');

const router = express.Router();

router.get('/', authController.protect, portfolioController.getPortfolioNames);

router.get(
  '/base/:portfolio',
  authController.protect,
  validationController.getPortfolioDataValidators,
  validationController.validate,
  portfolioController.getBasePortfolioData,
);

router.get(
  '/current/:portfolio',
  authController.protect,
  validationController.getPortfolioDataValidators,
  validationController.validate,
  portfolioController.getPortfolioDataWithPrices,
);

router.get(
  '/histo/:portfolio/:date',
  authController.protect,
  validationController.getHistoricalPortfolioValidators,
  validationController.validate,
  portfolioController.getHistoricalPortfolioValues,
);

module.exports = router;
