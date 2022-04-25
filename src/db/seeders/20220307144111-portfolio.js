'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
    */
    await queryInterface.bulkInsert('Portfolios', [{
      name: 'Plan',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Plan 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Plan 3',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Plan 4',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Plan 5',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */
     await queryInterface.bulkDelete('Portfolios', null, {});
  }
};
