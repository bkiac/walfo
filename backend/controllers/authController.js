const passport = require('passport');

exports.login = (req, res) => {
  passport.authenticate('local');

  res.send({
    isLoggedIn: true,
  });
};
