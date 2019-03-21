const express = require('express');
const authController = require('../controllers/authController');
const coinsController = require('../controllers/coinsController');

const router = express.Router();

router.get('/', authController.protect, coinsController.getCoinList);

module.exports = router;
