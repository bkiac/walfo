const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.validateRegister = async (req, res, next) => {
  req.checkBody('email', 'invalid email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });

  req.checkBody('password', 'empty password').notEmpty();
  req.checkBody('password-confirm', 'empty confirmed password').notEmpty();
  req.checkBody('password-confirm', 'passwords don\'t match').equals(req.body.password);

  let errorsResponse = [];

  const errors = req.validationErrors();
  if (errors) {
    errorsResponse = [...errors];
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const emailNotUniqueError = {
      location: 'body',
      param: 'email',
      msg: 'email already exists',
      value: req.body.email,
    };
    errorsResponse = [...errorsResponse, emailNotUniqueError];
  }

  if (errorsResponse.length > 0) {
    res.status(400).send(errorsResponse);
    return;
  }

  next();
};

exports.register = async (req, res, next) => {
  const { email, password } = req.body;
  await User.create({ email, password });

  next(); // pass to authController.login
};
