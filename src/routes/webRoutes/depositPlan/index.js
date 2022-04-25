// Product router
const express = require('express');
const DepositPlanRouter = express.Router();

// controller modules
const depositPlanController = require('../controllers/depositPlanController');

DepositPlanRouter.get('/', depositPlanController.index);

DepositPlanRouter.post('/', depositPlanController.create);

module.exports = DepositPlanRouter;
