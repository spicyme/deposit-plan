// Product router
const express = require('express');
const TransactionRouter = express.Router();

// controller modules
const transactionController = require('../controllers/transactionController');

TransactionRouter.get('/', transactionController.index);

TransactionRouter.post('/', transactionController.create);

module.exports = TransactionRouter;
