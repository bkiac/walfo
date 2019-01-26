const mongoose = require('mongoose');
const util = require('util');

const User = mongoose.model('User');

// TODO: Handle REST errors
exports.validateRegister = (req, res, next) => {
  req.checkBody('email', 'invalid email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });

  req.checkBody('password', 'empty password').notEmpty();
  req.checkBody('password-confirm', 'empty confirmed password').notEmpty();
  req.checkBody('password-confirm', 'passwords don\'t match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    return errors;
  }

  next(); // there were no errors!
};

// TODO: Handle REST errors
exports.register = async (req, res, next) => {
  const user = await new User({ email: req.body.email });
  await User.register(user, req.body.password);

  // const user = await new User({ email: req.body.email }).setPassword(req.body.password);
  // await user.save();

  next(); // pass to authController.login
};

