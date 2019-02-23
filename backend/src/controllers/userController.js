const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.register = async (req, res, next) => {
  const { email, password } = req.body;
  await User.create({ email, password });

  next(); // pass to authController.login
};
