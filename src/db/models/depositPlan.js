'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DepositPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DepositPlan.init({
    isMonthly: DataTypes.BOOLEAN,
    portfolio: DataTypes.JSON,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'DepositPlan',
  });
  return DepositPlan;
};