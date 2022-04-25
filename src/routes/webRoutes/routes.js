const auth = require('./auth/auth');
const user = require('./user');
const portfolio = require('./portfolio');
const userPortfolio = require('./userPortfolio');
const transaction = require('./transaction');
const depositPlan = require('./depositPlan');
const passport = require('passport');

module.exports = (app) => {
  app.use('/', auth);
  app.use('/user', passport.authenticate('jwt', { session: true }), user);
  app.use('/api/v1/portfolio', passport.authenticate('jwt', { session: true }), portfolio);
  app.use('/api/v1/uportfolio', passport.authenticate('jwt', { session: true }), userPortfolio);
  app.use('/api/v1/depositplan', passport.authenticate('jwt', { session: true }), depositPlan);
  app.use('/api/v1/transaction', passport.authenticate('jwt', { session: true }), transaction);
};
