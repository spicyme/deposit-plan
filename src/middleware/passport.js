// passport.js
const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');
const db = require('../db/models');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function (email, password, cb) {
      // this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
      db.User
        .findOne({
          where: { email },
          attributes: { include: ['password'] },
        })
        .then((user) => {
          if (user) {
            // Load hash from DB.
            bcrypt.compare(password, user.password).then(function (result) {
              if (result) {
                user = user.get({
                  plain: true,
                });
                return cb(null, _.omit(user, ['password']), {
                  message: 'Logged In Successfully',
                });
              } else {
                return cb(null, false, {
                  message: 'Incorrect email or password.',
                });
              }
            });
          } else {
            return cb(null, false, { message: 'Incorrect email or password.' });
          }
        })
        .catch((err) => {
          logger.error(err);
          cb(err);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    function (jwtPayload, cb) {
      // find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return db.User
        .findByPk(jwtPayload.id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          logger.error(err);
          return cb(err);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.User
    .findByPk(id)
    .then((user) => {
      return cb(null, user);
    })
    .catch((err) => {
      logger.error(err);
      return cb(err);
    });
});
