const express = require('express');
const validationController = require('../controllers/validationController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  validationController.registerValidators,
  validationController.validate,
  authController.register,
  authController.login,
);

router.post('/login', authController.login);

router.post(
  '/change-password',
  authController.protect,
  validationController.changePasswordValidators,
  validationController.validate,
  authController.changePassword,
);

module.exports = router;
