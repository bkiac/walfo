const express = require('express');
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');
const tagsController = require('../controllers/tagsController');
const validationController = require('../controllers/validationController');

const router = express.Router();

router.post(
  '',
  authController.protect,
  validationController.addTransactionValidators,
  validationController.validate,
  tagsController.handleTags,
  transactionController.createTransaction,
);

module.exports = router;
