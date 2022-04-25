'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
    */
    await queryInterface.bulkInsert('DepositPlans', [{
      isMonthly: false,
      portfolio: '{}',
      user_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      isMonthly: true,
      portfolio: '{}',
      user_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('DepositPlans', null, {});
  }
};
