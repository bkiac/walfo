const express = require('express');
const portfolioController = require('../controllers/portfolioController');

const router = express.Router();

router.get('/:portfolio', portfolioController.getPortfolioData);

router.get('/', portfolioController.getPortfolioNames);

module.exports = router;
