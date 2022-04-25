// user router
const express = require('express');
const UserRouter = express.Router();

// controller modules
const userController = require('../controllers/userController');

UserRouter.get('/', userController.index);

module.exports = UserRouter;
