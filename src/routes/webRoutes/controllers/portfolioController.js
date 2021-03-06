const db = require('../../../db/models');

const index = (req, res) => {
  db.Portfolio
    .findAll({})
    .then((portfolios) => {
      res.status(200).json({ portfolios });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).json(err);
    });
};

const create = async (req) => {
  const portfolios = await db.Portfolio.findOrCreate({
    where: { name: req.name },
    defaults: req,
    raw: true,
  });
  return portfolios;
};

const update = (req, res) => {
  db.Portfolio
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
