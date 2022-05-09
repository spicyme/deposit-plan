// auth router
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const AuthRouter = express.Router();
const bcrypt = require('bcryptjs');
const { schema } = require('../../../helper');
const saltRounds = 10;

// controller modules
const userController = require('../controllers/userController');

/* POST login. */
AuthRouter.post('/login', function (req, res, next) {
  passport.authenticate('local', { session: true }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ info });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: process.env.TOKENEXPIRY,
      });
      return res.json({ user, token, info });
    });
  })(req, res, next);
});

/* POST Create */
AuthRouter.post('/signup', function (req, res, next) {
  const { name, email, password } = req.body;
  const passwordIsValid = schema.validate(password);
  if (passwordIsValid) {
    return bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        logger.error(err);
        console.log(err);
      }
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          logger.error(err);
          console.log(err);
        }
        userController
          .createUser({
            name,
            email,
            password: hash
          })
          .then((userData) => {
            if (!userData[1]) {
              res.status(409).json('Email is taken');
            } else {
              res.json({ userData, msg: 'account created successfully' });
            }
          })
          .catch((err) => {
            logger.error(err);
            res.status(500).json(err);
          });
      });
    });
  } else {
    return res.status(400).json({
      error:
        'Password is not valid. Password must fulfull below criteria: 1. min length of 8. 2. have uppercase. 3. have lowercase. 4. must have digits. 5. must not have spaces',
    });
  }
});

module.exports = AuthRouter;
