const express = require('express');

const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');
const portfolioRoutes = require('./portfolioRoutes');
const priceRoutes = require('./priceRoutes');

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/transactions', transactionRoutes);
router.use('/portfolios', portfolioRoutes);
router.use('/prices', priceRoutes);

module.exports = router;
