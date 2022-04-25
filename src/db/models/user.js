'use strict';
// var test = require('./depositPlan')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      ref: DataTypes.STRING,
    },
    {
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      classMethods: {
        associate: function (models) {
        }
      },
      hooks: {
        afterCreate: function (user, options) {
          sequelize.models.DepositPlan.bulkCreate([
            { portfolio: {}, isMonthly: false, user_id: user.id },
            { portfolio: {}, isMonthly: true, user_id: user.id }
          ])
          .then(() => {
          })
          .catch((err) => {
            logger.error(err);
          });
        }
      }
    }
  );
  User.associate = function (models) {
    User.belongsToMany(models.Portfolio, {
      through: 'UserPortfolio',
      foreignKey: 'user_id'
    });
    User.hasMany(models.DepositPlan, {
      foreignKey: 'user_id',
    });
  };
  return User;
};
