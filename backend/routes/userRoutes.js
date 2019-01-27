const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../utils/errorHandlers');

const router = express.Router();

router.post(
  '/register',
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login,
);

module.exports = router;
