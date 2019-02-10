const express = require('express');
const transactionController = require('../controllers/transactionController');
const tagsController = require('../controllers/tagsController');

const router = express.Router();

router.post(
  '',
  transactionController.validateTransaction,
  tagsController.handleTags,
  transactionController.createTransaction,
);

router.get('', transactionController.getPositionsByUserAndPortfolio);

module.exports = router;
