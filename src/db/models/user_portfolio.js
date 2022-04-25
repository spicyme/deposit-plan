'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserPortfolio = sequelize.define(
    'User_portfolio',
    {
      user_id: DataTypes.INTEGER,
      portfolio_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      value: DataTypes.STRING,
    },
    {
      classMethods: {
        associate: function (models) {
        }
      },
      hooks: {
        afterCreate: async function (portfolio, options) {
          let currentDepositPlan = await sequelize.models.DepositPlan.findAll({
            where: { user_id: portfolio.user_id },
            raw: true
          })
          let oneTimePlan = { ...currentDepositPlan[0].portfolio }
          oneTimePlan[portfolio.id] = {
            id : portfolio.portfolio_id,
            value: 0
          }
          let monthlyPlan = { ...currentDepositPlan[1].portfolio }
          oneTimePlan[portfolio.id] = {
            id : portfolio.portfolio_id,
            value: 0
          }
          await sequelize.models.DepositPlan.update(
            { portfolio: oneTimePlan },
            {
              where: {
                user_id: portfolio.user_id,
                isMonthly: 0
              },
            }
          );
          await sequelize.models.DepositPlan.update(
            { portfolio: monthlyPlan },
            {
              where: {
                user_id: portfolio.user_id,
                isMonthly: 1
              },
            }
          );
        }
      }
    }
  );
  return UserPortfolio;
};
