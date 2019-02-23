const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const validationController = require('../controllers/validationController');

const router = express.Router();

router.post(
  '/register',
  validationController.registerValidators,
  validationController.validate,
  userController.register,
  authController.login,
);

module.exports = router;
