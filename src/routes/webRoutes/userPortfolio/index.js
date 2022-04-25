// Product router
const express = require('express');
const UserPortfolioRouter = express.Router();

// controller modules
const userPortfolioController = require('../controllers/userPortfolioController');

UserPortfolioRouter.get('/', userPortfolioController.index);

UserPortfolioRouter.post('/', userPortfolioController.create);

UserPortfolioRouter.put('/:productId', userPortfolioController.update);

module.exports = UserPortfolioRouter;
