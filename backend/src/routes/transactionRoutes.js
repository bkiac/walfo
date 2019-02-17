const express = require('express');
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');
const tagsController = require('../controllers/tagsController');

const router = express.Router();

router.post(
  '',
  authController.protect,
  transactionController.validateTransaction,
  tagsController.handleTags,
  transactionController.createTransaction,
);

module.exports = router;
