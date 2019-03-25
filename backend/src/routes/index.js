const express = require('express');
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');
const portfolioRoutes = require('./portfolioRoutes');
const coinsRoutes = require('./coinsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/transactions', transactionRoutes);
router.use('/portfolios', portfolioRoutes);
router.use('/coins', coinsRoutes);

module.exports = router;
