const express = require('express');
const authController = require('../controllers/authController');
const portfolioController = require('../controllers/portfolioController');
const validationController = require('../controllers/validationController');

const router = express.Router();

router.get('/', authController.protect, portfolioController.getPortfolioNames);

router.get(
  '/:portfolio',
  authController.protect,
  validationController.getPortfolioDataValidators,
  validationController.validate,
  portfolioController.getPortfolioData,
);

module.exports = router;
