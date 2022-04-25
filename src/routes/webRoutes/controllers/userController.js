const db = require('../../../db/models');
const { v4: uuidv4 } = require('uuid');

const index = (req, res) => {
  db.user
    .findAll({})
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).json(err);
    });
};

const createUser = async (req) => {
  const [user, created] = await db.User.findOrCreate({
    where: { email: req.email },
    defaults: { ...req, ref: uuidv4() },
    raw: true,
  });
  return [user, created];
};

module.exports = {
  index,
  createUser,
};
