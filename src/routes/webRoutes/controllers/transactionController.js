const db = require('../../../db/models');
const sequelize = require('sequelize');
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
  let m = 0
  let b = await db.User.findAll({
    where: { ref: req.body.ref },
    include: [
      { model: db.DepositPlan, attributes: ['portfolio'], where: { isMonthly: req.body.isMonthly } },
    ],
    raw: true
  })
  if (b.length === 0) {
    res.status(400).json({ message: "Ref key not found" });
  }
  let k = b[0]['DepositPlans.portfolio']
  for (var key of Object.keys(k)) {
    m = currency(k[key].value).add(currency(m))
  }
  for (var key of Object.keys(k)) {
    if (k[key].value !== 0) {
      k[key].ratio = k[key].value / m
    } else {
      k[key].ratio = 0
    }
  }
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    for (var key of Object.keys(k)) {
      const result = await db.User_portfolio.update(
        {
          value: sequelize.literal(`value + ${currency(req.body.value).multiply(k[key].ratio).value}`),
        },
        { where: { id: key }, transaction }
      )
    }
    let transaction1 = await db.Transaction.create({ ref: req.body.ref, proportion: k, value: currency(req.body.value).value, isMonthly: req.body.isMonthly }, { transaction })
    if (transaction1) {
      res.status(200).json({ transaction1 });
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

const getProduct = (req, res) => {
  db.transaction
    .findOne({
      where: { id: req.params.productId },
    })
    .then((product) => {
      res.status(200).json({ product });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  index,
  create,
  getProduct,
};
