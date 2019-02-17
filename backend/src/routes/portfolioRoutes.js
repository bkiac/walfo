const express = require('express');
const authController = require('../controllers/authController');
const portfolioController = require('../controllers/portfolioController');

const router = express.Router();

router.get('/:portfolio', authController.protect, portfolioController.getPortfolioData);

router.get('/', authController.protect, portfolioController.getPortfolioNames);

module.exports = router;
