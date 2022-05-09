const db = require('../../../db/models');
const currency = require('currency.js');

const index = (req, res) => {
  db.Transaction
    .findAll({
      where: { ref: req.user.ref }
    })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).json(err);
    });
};

const create = async (req, res) => {
  let totalDepositPlanAmount = 0
  let portfolioDebit = []
  let sum = 0
  let myDepositPlan = await db.User.findAll({
    where: { ref: req.body.ref },
    include: [
      { model: db.DepositPlan, attributes: ['portfolio'], where: { isMonthly: req.body.isMonthly } },
    ],
    raw: true
  })
  if (myDepositPlan.length === 0) {
    res.status(400).json({ message: "Ref key not found" });
  }
  let myPortfolio = myDepositPlan[0]['DepositPlans.portfolio']
  for (var key of Object.keys(myPortfolio)) {
    totalDepositPlanAmount = currency(myPortfolio[key].value).add(currency(totalDepositPlanAmount))
  }
  if (totalDepositPlanAmount == 0) {
    res.status(406).json({ code: 406, message: "Please update deposit plan first" });
  }
  for (var key of Object.keys(myPortfolio)) {
    portfolioDebit.push(currency(req.body.value).multiply(myPortfolio[key].value).divide(totalDepositPlanAmount))
  }
  for (let i = 0; i < portfolioDebit.length; i++) {
    sum = currency(sum).add(portfolioDebit[i])
  }
  if (sum.value !== req.body.value) {
    portfolioDebit[0] = currency(portfolioDebit[0]).add(currency(req.body.value - sum.value))
  }
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    for (const [index, [key, value]] of Object.entries(Object.entries(myPortfolio))) {
      const project = await db.User_portfolio.findOne({ where: { id: key } });
      await db.User_portfolio.update(
        {
          value: currency(project.value).add(portfolioDebit[index]).value,
        },
        { where: { id: key }, transaction }
      )
    }
    let createdTransaction = await db.Transaction.create({ ref: req.body.ref, proportion: myPortfolio, value: currency(req.body.value).value, isMonthly: req.body.isMonthly }, { transaction })
    if (createdTransaction) {
      res.status(200).json({ createdTransaction });
    } else {
      logger.error(err);
      res.status(500).json(err);
    }
    await transaction.commit();
  } catch (error) {
    console.log('error', error);
    if (transaction) {
      await transaction.rollback();
    }
  }
};

module.exports = {
  index,
  create,
};
