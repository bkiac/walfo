const express = require('express');
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');
const tagsController = require('../controllers/tagsController');
const validationController = require('../controllers/validationController');

const router = express.Router();

router.post(
  '',
  authController.protect,
  validationController.createTransactionValidators,
  validationController.validate,
  tagsController.createTags,
  transactionController.createTransaction,
);

router.put(
  '/:id',
  authController.protect,
  validationController.updateTransactionsValidators,
  validationController.validate,
  tagsController.updateTags,
  transactionController.updateTransaction,
);

router.delete(
  '/:id',
  authController.protect,
  validationController.deleteTransactionValidators,
  validationController.validate,
  tagsController.deleteTags,
  transactionController.deleteTransaction,
);

module.exports = router;
