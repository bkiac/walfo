const mongoose = require('mongoose');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, cb) => {
      User.findOne({ email })
        .then(user => {
          if (!user || !user.validatePassword(password)) {
            return cb(null, false);
          }
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (JWTPayload, cb) => {
      User.findOne({ _id: JWTPayload.id })
        .then(user => {
          if (!user) {
            console.log(JWTPayload);
            throw Error(
              `There is no user with ID ${
                JWTPayload.id
              } for '${JWTPayload}' JWT token, generally this shouldn't happen.`,
            );
          }
          return cb(null, user._id);
        })
        .catch(err => {
          return cb(err);
        });
    },
  ),
);
