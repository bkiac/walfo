const express = require('express');
const coinsController = require('../controllers/coinsController');

const router = express.Router();

router.get('/', coinsController.getCoinList);
router.get('/top/volume', coinsController.getTopCoinsByVolume);
router.get('/top/market-cap', coinsController.getTopCoinsByMarketCap);

module.exports = router;
