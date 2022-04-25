// Product router
const express = require('express');
const PortfolioRouter = express.Router();

// controller modules
const portfolioController = require('../controllers/portfolioController');

PortfolioRouter.get('/', portfolioController.index);

PortfolioRouter.post('/', function (req, res, next) {
  portfolioController
    .create(req.body)
    .then((product) => {
      if (!product[1]) {
        return res.status(409).json('Product is exist');
      } else {
        const data = product[0];
        res.status(200).json({ data, msg: 'Created succesfully' });
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).json(err);
    });
});

module.exports = PortfolioRouter;
