const db = require('../../../db/models');

const index = (req, res) => {
  db.User_portfolio
    .findAll({
      where: { user_id: req.user.id },
    })
    .then((product) => {
      res.status(200).json({ product });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).json(err);
    });
};

const create = async (req, res) => {
  db.User_portfolio
    .create({ user_id: req.user.id, portfolio_id: req.body.portfolio_id, value: 0, name: req.body.name })
    .then((product) => {
      res.status(200).json({ product });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).json(err);
    });
};

const update = (req, res) => {
  db.User_portfolio
    .update(req.body, {
      where: { id: req.params.productId },
    })
    .then((rowUpdated) => {
      if (rowUpdated[0] === 1) {
        res.status(200).json({ message: 'Succesfully updated' });
      } else {
        res.status(404).json({ message: 'record not found' });
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  index,
  create,
  update,
};
